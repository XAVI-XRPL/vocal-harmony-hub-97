/**
 * Web Audio API Engine
 * 
 * A singleton service that manages sample-accurate multi-stem audio playback
 * using the Web Audio API. Replaces Howler.js/HTML5 Audio for better mobile
 * performance and zero-drift synchronization.
 * 
 * Architecture:
 * - Single AudioContext (one clock = no drift)
 * - Master GainNode for global volume
 * - Per-stem GainNode for individual volume/mute control
 * - AudioBufferSourceNode for each stem (recreated on seek/stop)
 */

import { Song, Stem } from '@/types';

// ============= Types =============

export type PlaybackState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused';
export type AudioMode = 'mixdown' | 'crossfading' | 'stems';

export interface StemLoadProgress {
  stemId: string;
  stemName: string;
  progress: number; // 0-100
  loaded: boolean;
  error?: string;
}

export interface EngineState {
  playbackState: PlaybackState;
  audioMode: AudioMode;
  currentTime: number;
  duration: number;
  mixdownProgress: number; // 0-100
  stemLoadProgress: StemLoadProgress[];
  isLooping: boolean;
  loopStart: number;
  loopEnd: number;
  playbackRate: number;
}

export interface StemConfig {
  id: string;
  name: string;
  url: string;
  color: string;
  type: string;
}

export interface SongConfig {
  songId: string;
  mixdownUrl?: string;
  stems: StemConfig[];
  duration?: number;
}

type StateListener = (state: EngineState) => void;

// ============= Internal Stem Data =============

interface StemData {
  id: string;
  name: string;
  buffer: AudioBuffer | null;
  sourceNode: AudioBufferSourceNode | null;
  gainNode: GainNode;
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
}

// ============= Singleton Engine =============

class WebAudioEngine {
  private static instance: WebAudioEngine;
  
  // Audio Context
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  
  // Mixdown (Phase 1)
  private mixdownBuffer: AudioBuffer | null = null;
  private mixdownSourceNode: AudioBufferSourceNode | null = null;
  private mixdownGainNode: GainNode | null = null;
  
  // Stems (Phase 2-4)
  private stems: Map<string, StemData> = new Map();
  
  // State
  private state: EngineState = {
    playbackState: 'idle',
    audioMode: 'mixdown',
    currentTime: 0,
    duration: 0,
    mixdownProgress: 0,
    stemLoadProgress: [],
    isLooping: false,
    loopStart: 0,
    loopEnd: 0,
    playbackRate: 1,
  };
  
  // Playback tracking
  private playStartTime: number = 0; // AudioContext.currentTime when play started
  private playStartOffset: number = 0; // Position in song when play started
  private animationFrameId: number | null = null;
  private loopCheckIntervalId: NodeJS.Timeout | null = null;
  
  // Subscribers
  private listeners: Set<StateListener> = new Set();
  
  // Abort controller for fetch operations
  private abortController: AbortController | null = null;
  
  // Current song config
  private currentSongId: string | null = null;
  
  // Wake Lock
  private wakeLock: WakeLockSentinel | null = null;
  
  private constructor() {}
  
  static getInstance(): WebAudioEngine {
    if (!WebAudioEngine.instance) {
      WebAudioEngine.instance = new WebAudioEngine();
    }
    return WebAudioEngine.instance;
  }
  
  // ============= Public API =============
  
  /**
   * Initialize the AudioContext. MUST be called from a user gesture (click/tap).
   */
  async init(): Promise<void> {
    if (this.audioContext?.state === 'running') {
      return;
    }
    
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      
      // Create master gain
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.connect(this.audioContext.destination);
    }
    
    // Resume if suspended (mobile requirement)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    console.log('🎵 WebAudioEngine initialized');
  }
  
  /**
   * Load a song with optional mixdown-first strategy.
   */
  async loadSong(config: SongConfig): Promise<void> {
    // Abort any pending loads
    this.abort();
    this.cleanup();
    
    this.currentSongId = config.songId;
    this.abortController = new AbortController();
    
    // Initialize stem progress tracking
    const stemProgress: StemLoadProgress[] = config.stems.map(s => ({
      stemId: s.id,
      stemName: s.name,
      progress: 0,
      loaded: false,
    }));
    
    this.updateState({
      playbackState: 'loading',
      audioMode: 'mixdown',
      currentTime: 0,
      duration: config.duration || 0,
      mixdownProgress: 0,
      stemLoadProgress: stemProgress,
    });
    
    try {
      await this.ensureContext();
      
      // Strategy: Load all stems (no separate mixdown in this implementation)
      // Could be enhanced to load mixdown first if URLs are provided
      await this.loadAllStems(config.stems);
      
      // Get duration from first loaded buffer
      const firstStem = Array.from(this.stems.values()).find(s => s.buffer);
      if (firstStem?.buffer) {
        this.updateState({ duration: firstStem.buffer.duration });
      }
      
      this.updateState({
        playbackState: 'ready',
        audioMode: 'stems',
      });
      
      console.log(`✓ Song loaded: ${config.songId}`);
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Load aborted');
        return;
      }
      console.error('Failed to load song:', error);
      this.updateState({ playbackState: 'idle' });
      throw error;
    }
  }
  
  /**
   * Start or resume playback.
   */
  play(): void {
    if (this.state.playbackState !== 'ready' && this.state.playbackState !== 'paused') {
      console.warn('Cannot play: not ready or paused');
      return;
    }
    
    this.ensureContext();
    this.createAndStartSources(this.state.currentTime);
    this.updateState({ playbackState: 'playing' });
    this.startTimeTracking();
    this.acquireWakeLock();
    this.updateMediaSession();
  }
  
  /**
   * Pause playback.
   */
  pause(): void {
    if (this.state.playbackState !== 'playing') return;
    
    // Record current position before stopping
    const currentTime = this.getCurrentTime();
    
    this.stopAllSources();
    this.stopTimeTracking();
    
    this.updateState({
      playbackState: 'paused',
      currentTime,
    });
    
    this.releaseWakeLock();
  }
  
  /**
   * Seek to a specific time.
   */
  seek(time: number): void {
    const clampedTime = Math.max(0, Math.min(time, this.state.duration));
    
    if (this.state.playbackState === 'playing') {
      // Stop current sources and restart at new position
      this.stopAllSources();
      this.createAndStartSources(clampedTime);
      this.updateState({ currentTime: clampedTime });
    } else {
      // Just update the position
      this.updateState({ currentTime: clampedTime });
    }
  }
  
  /**
   * Stop playback and reset to beginning.
   */
  stop(): void {
    this.stopAllSources();
    this.stopTimeTracking();
    
    this.updateState({
      playbackState: this.stems.size > 0 ? 'ready' : 'idle',
      currentTime: 0,
    });
    
    this.releaseWakeLock();
  }
  
  /**
   * Set volume for a specific stem (0-1).
   */
  setStemVolume(stemId: string, volume: number): void {
    const stem = this.stems.get(stemId);
    if (!stem) return;
    
    stem.volume = Math.max(0, Math.min(1, volume));
    this.updateStemGain(stem);
  }
  
  /**
   * Set mute state for a specific stem.
   */
  setStemMuted(stemId: string, muted: boolean): void {
    const stem = this.stems.get(stemId);
    if (!stem) return;
    
    stem.isMuted = muted;
    this.updateStemGain(stem);
  }
  
  /**
   * Set solo state for a specific stem.
   */
  setStemSolo(stemId: string, solo: boolean): void {
    const stem = this.stems.get(stemId);
    if (!stem) return;
    
    stem.isSolo = solo;
    
    // Update all stem gains (solo affects all stems)
    this.stems.forEach(s => this.updateStemGain(s));
  }
  
  /**
   * Set master mute (all stems).
   */
  setMasterMuted(muted: boolean): void {
    this.stems.forEach(stem => {
      stem.isMuted = muted;
      this.updateStemGain(stem);
    });
  }
  
  /**
   * Set loop region.
   */
  setLoop(start: number, end: number): void {
    this.updateState({
      isLooping: true,
      loopStart: start,
      loopEnd: end,
    });
  }
  
  /**
   * Toggle loop on/off.
   */
  toggleLoop(): void {
    this.updateState({ isLooping: !this.state.isLooping });
  }
  
  /**
   * Clear loop region.
   */
  clearLoop(): void {
    this.updateState({
      isLooping: false,
      loopStart: 0,
      loopEnd: 0,
    });
  }
  
  /**
   * Set playback rate (0.5 - 2.0).
   */
  setPlaybackRate(rate: number): void {
    const clampedRate = Math.max(0.5, Math.min(2, rate));
    this.updateState({ playbackRate: clampedRate });
    
    // Update all active source nodes
    this.stems.forEach(stem => {
      if (stem.sourceNode) {
        stem.sourceNode.playbackRate.value = clampedRate;
      }
    });
  }
  
  /**
   * Get current state.
   */
  getState(): EngineState {
    return { ...this.state };
  }
  
  /**
   * Subscribe to state changes.
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  /**
   * Abort all pending operations.
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  
  /**
   * Clean up all resources.
   */
  cleanup(): void {
    this.stopAllSources();
    this.stopTimeTracking();
    this.releaseWakeLock();
    
    // Clear stem data
    this.stems.forEach(stem => {
      if (stem.gainNode) {
        stem.gainNode.disconnect();
      }
    });
    this.stems.clear();
    
    // Clear mixdown
    this.mixdownBuffer = null;
    if (this.mixdownSourceNode) {
      this.mixdownSourceNode.disconnect();
      this.mixdownSourceNode = null;
    }
    if (this.mixdownGainNode) {
      this.mixdownGainNode.disconnect();
      this.mixdownGainNode = null;
    }
    
    this.currentSongId = null;
    
    this.updateState({
      playbackState: 'idle',
      audioMode: 'mixdown',
      currentTime: 0,
      duration: 0,
      mixdownProgress: 0,
      stemLoadProgress: [],
    });
  }
  
  /**
   * Check if context is ready.
   */
  isReady(): boolean {
    return this.audioContext?.state === 'running';
  }
  
  // ============= Private Methods =============
  
  private async ensureContext(): Promise<void> {
    if (!this.audioContext) {
      await this.init();
    }
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
  
  private async loadAllStems(stems: StemConfig[]): Promise<void> {
    if (!this.audioContext || !this.masterGainNode) {
      throw new Error('AudioContext not initialized');
    }
    
    const loadPromises = stems.map(async (stemConfig, index) => {
      try {
        // Create gain node for this stem
        const gainNode = this.audioContext!.createGain();
        gainNode.connect(this.masterGainNode!);
        
        // Initialize stem data
        const stemData: StemData = {
          id: stemConfig.id,
          name: stemConfig.name,
          buffer: null,
          sourceNode: null,
          gainNode,
          volume: 0.8,
          isMuted: false,
          isSolo: false,
        };
        this.stems.set(stemConfig.id, stemData);
        
        // Fetch with progress tracking
        const response = await fetch(stemConfig.url, {
          signal: this.abortController?.signal,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Update progress to show download complete
        this.updateStemProgress(stemConfig.id, 80, false);
        
        // Decode audio data
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
        
        stemData.buffer = audioBuffer;
        this.updateStemProgress(stemConfig.id, 100, true);
        
        console.log(`✓ Stem loaded: ${stemConfig.name}`);
      } catch (error) {
        if ((error as Error).name === 'AbortError') throw error;
        
        console.error(`Failed to load stem ${stemConfig.name}:`, error);
        this.updateStemProgress(stemConfig.id, 0, false, (error as Error).message);
      }
    });
    
    await Promise.all(loadPromises);
    
    // Verify at least some stems loaded
    const loadedCount = Array.from(this.stems.values()).filter(s => s.buffer).length;
    if (loadedCount === 0) {
      throw new Error('No stems could be loaded');
    }
  }
  
  private updateStemProgress(stemId: string, progress: number, loaded: boolean, error?: string): void {
    const newProgress = this.state.stemLoadProgress.map(sp =>
      sp.stemId === stemId ? { ...sp, progress, loaded, error } : sp
    );
    this.updateState({ stemLoadProgress: newProgress });
  }
  
  private createAndStartSources(startOffset: number): void {
    if (!this.audioContext) return;
    
    // Record when we started playing
    this.playStartTime = this.audioContext.currentTime;
    this.playStartOffset = startOffset;
    
    // Create new source nodes for all stems with buffers
    this.stems.forEach(stem => {
      if (!stem.buffer || !this.audioContext) return;
      
      // Create new source (they're single-use)
      const source = this.audioContext.createBufferSource();
      source.buffer = stem.buffer;
      source.playbackRate.value = this.state.playbackRate;
      source.connect(stem.gainNode);
      
      // Handle end of playback
      source.onended = () => {
        if (this.state.playbackState === 'playing') {
          // Check if we're looping
          if (this.state.isLooping && this.state.loopEnd > this.state.loopStart) {
            // Will be handled by loop check interval
          } else {
            // Natural end of song
            const currentTime = this.getCurrentTime();
            if (currentTime >= this.state.duration - 0.1) {
              this.stop();
            }
          }
        }
      };
      
      stem.sourceNode = source;
      
      // Start at offset
      source.start(0, startOffset);
    });
    
    // Start loop checking
    this.startLoopChecking();
  }
  
  private stopAllSources(): void {
    this.stems.forEach(stem => {
      if (stem.sourceNode) {
        try {
          stem.sourceNode.stop();
        } catch (e) {
          // Already stopped
        }
        stem.sourceNode.disconnect();
        stem.sourceNode = null;
      }
    });
    
    // Stop mixdown if playing
    if (this.mixdownSourceNode) {
      try {
        this.mixdownSourceNode.stop();
      } catch (e) {}
      this.mixdownSourceNode.disconnect();
      this.mixdownSourceNode = null;
    }
    
    this.stopLoopChecking();
  }
  
  private updateStemGain(stem: StemData): void {
    if (!stem.gainNode) return;
    
    // Check if any stem is soloed
    const anySolo = Array.from(this.stems.values()).some(s => s.isSolo);
    
    let gain = stem.volume;
    
    // If any stem is soloed, only play soloed stems
    if (anySolo && !stem.isSolo) {
      gain = 0;
    }
    
    // If muted, set to 0
    if (stem.isMuted) {
      gain = 0;
    }
    
    // Apply with short ramp for smooth transitions
    if (this.audioContext) {
      stem.gainNode.gain.setTargetAtTime(
        gain,
        this.audioContext.currentTime,
        0.02 // 20ms time constant for smooth fade
      );
    } else {
      stem.gainNode.gain.value = gain;
    }
  }
  
  private getCurrentTime(): number {
    if (!this.audioContext || this.state.playbackState !== 'playing') {
      return this.state.currentTime;
    }
    
    const elapsed = (this.audioContext.currentTime - this.playStartTime) * this.state.playbackRate;
    return this.playStartOffset + elapsed;
  }
  
  private startTimeTracking(): void {
    this.stopTimeTracking();
    
    const updateTime = () => {
      if (this.state.playbackState === 'playing') {
        const currentTime = this.getCurrentTime();
        this.updateState({ currentTime });
        this.animationFrameId = requestAnimationFrame(updateTime);
      }
    };
    
    this.animationFrameId = requestAnimationFrame(updateTime);
  }
  
  private stopTimeTracking(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  private startLoopChecking(): void {
    this.stopLoopChecking();
    
    this.loopCheckIntervalId = setInterval(() => {
      if (this.state.playbackState !== 'playing') return;
      if (!this.state.isLooping) return;
      if (this.state.loopEnd <= this.state.loopStart) return;
      
      const currentTime = this.getCurrentTime();
      
      // Check if we've passed the loop end point
      if (currentTime >= this.state.loopEnd - 0.05) {
        console.log('Loop: jumping back to start');
        this.stopAllSources();
        this.createAndStartSources(this.state.loopStart);
        this.updateState({ currentTime: this.state.loopStart });
      }
    }, 50); // Check every 50ms for responsive looping
  }
  
  private stopLoopChecking(): void {
    if (this.loopCheckIntervalId) {
      clearInterval(this.loopCheckIntervalId);
      this.loopCheckIntervalId = null;
    }
  }
  
  private async acquireWakeLock(): Promise<void> {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        console.log('🔒 Wake lock acquired');
      } catch (err) {
        console.log('Wake lock not available:', err);
      }
    }
  }
  
  private releaseWakeLock(): void {
    if (this.wakeLock) {
      this.wakeLock.release().then(() => {
        console.log('🔓 Wake lock released');
      });
      this.wakeLock = null;
    }
  }
  
  private updateMediaSession(): void {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('stop', () => this.stop());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seek(details.seekTime);
        }
      });
    }
  }
  
  private updateState(partial: Partial<EngineState>): void {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (e) {
        console.error('Error in state listener:', e);
      }
    });
  }
}

// Export singleton instance
export const webAudioEngine = WebAudioEngine.getInstance();
