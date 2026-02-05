/**
 * Web Audio API Engine
 * 
 * A singleton service that manages sample-accurate multi-stem audio playback
 * using the Web Audio API. Implements a mixdown-first loading strategy:
 * 
 * Phase 1: Load and play mixdown immediately (~1-2 seconds)
 * Phase 2: Background-load all stems while mixdown plays
 * Phase 3: Crossfade from mixdown to stems (200ms)
 * Phase 4: Stem mixer fully active
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
  mixdownReady: boolean;
  stemLoadProgress: StemLoadProgress[];
  allStemsReady: boolean;
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

// ============= Constants =============

const CROSSFADE_DURATION = 0.2; // 200ms crossfade

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
    mixdownReady: false,
    stemLoadProgress: [],
    allStemsReady: false,
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
  private currentSongConfig: SongConfig | null = null;
  
  // Wake Lock
  private wakeLock: WakeLockSentinel | null = null;
  
  // Background loading promise
  private backgroundLoadPromise: Promise<void> | null = null;
  
  private constructor() {}
  
  static getInstance(): WebAudioEngine {
    if (!WebAudioEngine.instance) {
      WebAudioEngine.instance = new WebAudioEngine();
    }
    return WebAudioEngine.instance;
  }
  
  // ============= Public API =============
  
  /**
   * Ensure AudioContext and master gain node exist (no resume).
   * Safe to call during background loading.
   */
  private ensureContextCreated(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      
      // Create master gain
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.connect(this.audioContext.destination);
      
      console.log('🎵 AudioContext created');
    }
  }
  
  /**
   * Resume AudioContext. MUST be called from a user gesture (click/tap).
   */
  private async ensureContextRunning(): Promise<void> {
    this.ensureContextCreated();
    
    if (this.audioContext!.state === 'suspended') {
      await this.audioContext!.resume();
      console.log('🎵 AudioContext resumed');
    }
  }
  
  /**
   * Initialize the AudioContext. MUST be called from a user gesture (click/tap).
   */
  async init(): Promise<void> {
    await this.ensureContextRunning();
  }
  
  /**
   * Load a song with mixdown-first strategy.
   * If mixdownUrl is provided, it plays immediately while stems load in background.
   */
  async loadSong(config: SongConfig): Promise<void> {
    // Abort any pending loads
    this.abort();
    this.cleanup();
    
    this.currentSongId = config.songId;
    this.currentSongConfig = config;
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
      mixdownReady: false,
      stemLoadProgress: stemProgress,
      allStemsReady: false,
    });
    
    try {
      // Create context (no resume required for loading)
      this.ensureContextCreated();
      
      // If we have a mixdown URL, use mixdown-first strategy
      if (config.mixdownUrl) {
        console.log('📻 Mixdown-first loading strategy');
        await this.loadMixdownFirst(config);
      } else {
        // Fallback: load all stems (no mixdown available)
        console.log('🎹 Loading all stems (no mixdown)');
        await this.loadAllStems(config.stems);
        
        // Get duration from first loaded buffer
        const firstStem = Array.from(this.stems.values()).find(s => s.buffer);
        if (firstStem?.buffer) {
          this.updateState({ duration: firstStem.buffer.duration });
        }
        
        this.updateState({
          playbackState: 'ready',
          audioMode: 'stems',
          allStemsReady: true,
        });
      }
      
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
    // Can play in 'ready' or 'paused' state
    // Also allow playing if mixdown is ready (even if stems aren't)
    const canPlay = 
      this.state.playbackState === 'ready' || 
      this.state.playbackState === 'paused' ||
      (this.state.playbackState === 'loading' && this.state.mixdownReady);
    
    if (!canPlay) {
      console.warn('Cannot play: not ready or paused');
      return;
    }
    
    // Ensure context is running (play() should only be called after init())
    this.ensureContextCreated();
    
    // Determine what to play based on current mode
    if (this.state.audioMode === 'mixdown' && this.mixdownBuffer) {
      this.createAndStartMixdownSource(this.state.currentTime);
    } else if (this.state.audioMode === 'stems' || this.state.allStemsReady) {
      this.createAndStartStemSources(this.state.currentTime);
    } else if (this.mixdownBuffer) {
      // Fallback to mixdown if stems not ready
      this.createAndStartMixdownSource(this.state.currentTime);
    }
    
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
      
      if (this.state.audioMode === 'stems' && this.state.allStemsReady) {
        this.createAndStartStemSources(clampedTime);
      } else if (this.mixdownBuffer) {
        this.createAndStartMixdownSource(clampedTime);
      }
      
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
    
    const isReady = this.stems.size > 0 || this.mixdownBuffer !== null;
    
    this.updateState({
      playbackState: isReady ? 'ready' : 'idle',
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
    
    // Update mixdown source if playing
    if (this.mixdownSourceNode) {
      this.mixdownSourceNode.playbackRate.value = clampedRate;
    }
    
    // Update all active stem source nodes
    this.stems.forEach(stem => {
      if (stem.sourceNode) {
        stem.sourceNode.playbackRate.value = clampedRate;
      }
    });
  }
  
  /**
   * Get current state.
   * IMPORTANT: For React external-store subscriptions, this must be referentially stable
   * and only change when the internal state changes.
   */
  getState(): EngineState {
    return this.state;
  }

  /**
   * Subscribe to state changes (legacy).
   * Calls listener immediately with current state and on every change.
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
   * Subscribe to state *changes* only (React useSyncExternalStore-compatible).
   * The callback must be invoked ONLY when the store changes and should NOT be called immediately.
   */
  subscribeOnChange(onStoreChange: () => void): () => void {
    const listener: StateListener = () => onStoreChange();
    this.listeners.add(listener);

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
    this.currentSongConfig = null;
    this.backgroundLoadPromise = null;
    
    this.updateState({
      playbackState: 'idle',
      audioMode: 'mixdown',
      currentTime: 0,
      duration: 0,
      mixdownProgress: 0,
      mixdownReady: false,
      stemLoadProgress: [],
      allStemsReady: false,
    });
  }
  
  /**
   * Check if context is ready.
   */
  isReady(): boolean {
    return this.audioContext?.state === 'running';
  }
  
  // ============= Mixdown-First Loading =============
  
  /**
   * Phase 1: Load and play mixdown immediately
   * Phase 2: Background load all stems
   * Phase 3: Crossfade to stems when ready
   */
  private async loadMixdownFirst(config: SongConfig): Promise<void> {
    if (!config.mixdownUrl || !this.audioContext || !this.masterGainNode) {
      throw new Error('Mixdown URL or AudioContext not available');
    }
    
    // Create mixdown gain node
    this.mixdownGainNode = this.audioContext.createGain();
    this.mixdownGainNode.connect(this.masterGainNode);
    
    // Phase 1: Load mixdown
    console.log('📻 Phase 1: Loading mixdown...');
    try {
      const response = await fetch(config.mixdownUrl, {
        signal: this.abortController?.signal,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} loading mixdown`);
      }
      
      // Track download progress
      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      let receivedBytes = 0;
      
      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          receivedBytes += value.length;
          
          if (totalBytes > 0) {
            const progress = Math.round((receivedBytes / totalBytes) * 80);
            this.updateState({ mixdownProgress: progress });
          }
        }
      }
      
      // Combine chunks into single array buffer
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const arrayBuffer = new ArrayBuffer(totalLength);
      const uint8Array = new Uint8Array(arrayBuffer);
      let offset = 0;
      for (const chunk of chunks) {
        uint8Array.set(chunk, offset);
        offset += chunk.length;
      }
      
      this.updateState({ mixdownProgress: 90 });
      
      // Decode mixdown
      this.mixdownBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Update state - mixdown is ready!
      this.updateState({
        mixdownProgress: 100,
        mixdownReady: true,
        playbackState: 'ready',
        duration: this.mixdownBuffer.duration,
      });
      
      console.log(`✓ Mixdown ready (${this.mixdownBuffer.duration.toFixed(1)}s)`);
      
    } catch (error) {
      if ((error as Error).name === 'AbortError') throw error;
      console.error('Failed to load mixdown:', error);
      // Fall back to loading stems directly
      await this.loadAllStems(config.stems);
      return;
    }
    
    // Phase 2: Background load stems
    console.log('📻 Phase 2: Loading stems in background...');
    this.backgroundLoadPromise = this.loadStemsInBackground(config.stems);
    
    // Don't await - let stems load in background
    this.backgroundLoadPromise.then(() => {
      console.log('✓ All stems loaded in background');
      
      // If currently playing mixdown, crossfade to stems
      if (this.state.playbackState === 'playing' && this.state.audioMode === 'mixdown') {
        this.crossfadeToStems();
      } else {
        // Just mark stems as ready
        this.updateState({
          audioMode: 'stems',
          allStemsReady: true,
        });
      }
    }).catch(error => {
      if ((error as Error).name !== 'AbortError') {
        console.error('Background stem loading failed:', error);
      }
    });
  }
  
  /**
   * Load all stems in parallel in the background.
   */
  private async loadStemsInBackground(stems: StemConfig[]): Promise<void> {
    if (!this.audioContext || !this.masterGainNode) {
      throw new Error('AudioContext not initialized');
    }
    
    const loadPromises = stems.map(async (stemConfig) => {
      try {
        // Create gain node for this stem
        const gainNode = this.audioContext!.createGain();
        gainNode.gain.value = 0; // Start muted - will fade in during crossfade
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
        
        // Fetch audio file
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
    
    this.updateState({ allStemsReady: true });
  }
  
  /**
   * Phase 3: Crossfade from mixdown to stems.
   * Uses AudioParam scheduling for sample-accurate transition.
   */
  private crossfadeToStems(): void {
    if (!this.audioContext || !this.mixdownGainNode) {
      console.warn('Cannot crossfade: context or mixdown not available');
      return;
    }
    
    const currentTime = this.getCurrentTime();
    const contextTime = this.audioContext.currentTime;
    
    console.log(`🔀 Phase 3: Crossfading to stems at ${currentTime.toFixed(2)}s`);
    
    this.updateState({ audioMode: 'crossfading' });
    
    // Start all stem sources at current position (with gain at 0)
    this.stems.forEach(stem => {
      if (!stem.buffer || !this.audioContext) return;
      
      const source = this.audioContext.createBufferSource();
      source.buffer = stem.buffer;
      source.playbackRate.value = this.state.playbackRate;
      source.connect(stem.gainNode);
      
      // Start at current playback position
      source.start(0, currentTime);
      
      stem.sourceNode = source;
      
      // Schedule gain ramp up
      stem.gainNode.gain.setValueAtTime(0, contextTime);
      stem.gainNode.gain.linearRampToValueAtTime(stem.volume, contextTime + CROSSFADE_DURATION);
    });
    
    // Schedule mixdown fade out
    this.mixdownGainNode.gain.setValueAtTime(1, contextTime);
    this.mixdownGainNode.gain.linearRampToValueAtTime(0, contextTime + CROSSFADE_DURATION);
    
    // After crossfade, stop mixdown and update state
    setTimeout(() => {
      if (this.mixdownSourceNode) {
        try {
          this.mixdownSourceNode.stop();
        } catch (e) {}
        this.mixdownSourceNode.disconnect();
        this.mixdownSourceNode = null;
      }
      
      this.updateState({ audioMode: 'stems' });
      console.log('✓ Crossfade complete - stem mixer active');
    }, CROSSFADE_DURATION * 1000 + 50); // Small buffer after fade
  }
  
  // ============= Fallback: Load All Stems =============
  
  private async loadAllStems(stems: StemConfig[]): Promise<void> {
    if (!this.audioContext || !this.masterGainNode) {
      throw new Error('AudioContext not initialized');
    }
    
    const loadPromises = stems.map(async (stemConfig) => {
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
    
    this.updateState({ allStemsReady: true });
  }
  
  private updateStemProgress(stemId: string, progress: number, loaded: boolean, error?: string): void {
    const newProgress = this.state.stemLoadProgress.map(sp =>
      sp.stemId === stemId ? { ...sp, progress, loaded, error } : sp
    );
    this.updateState({ stemLoadProgress: newProgress });
  }
  
  // ============= Playback Control =============
  
  private createAndStartMixdownSource(startOffset: number): void {
    if (!this.audioContext || !this.mixdownBuffer || !this.mixdownGainNode) return;
    
    // Record when we started playing
    this.playStartTime = this.audioContext.currentTime;
    this.playStartOffset = startOffset;
    
    // Create new source for mixdown
    const source = this.audioContext.createBufferSource();
    source.buffer = this.mixdownBuffer;
    source.playbackRate.value = this.state.playbackRate;
    source.connect(this.mixdownGainNode);
    
    // Ensure mixdown gain is at 1
    this.mixdownGainNode.gain.value = 1;
    
    source.onended = () => {
      if (this.state.playbackState === 'playing' && this.state.audioMode === 'mixdown') {
        const currentTime = this.getCurrentTime();
        if (currentTime >= this.state.duration - 0.1) {
          this.stop();
        }
      }
    };
    
    this.mixdownSourceNode = source;
    source.start(0, startOffset);
    
    // Start loop checking
    this.startLoopChecking();
  }
  
  private createAndStartStemSources(startOffset: number): void {
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
      
      // Set proper gain based on solo/mute state
      this.updateStemGain(stem);
      
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
    // Stop stem sources
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
        
        // Restart appropriate sources
        if (this.state.audioMode === 'stems' && this.state.allStemsReady) {
          this.createAndStartStemSources(this.state.loopStart);
        } else if (this.mixdownBuffer) {
          this.createAndStartMixdownSource(this.state.loopStart);
        }
        
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
  
  private async ensureContext(): Promise<void> {
    if (!this.audioContext) {
      await this.init();
    }
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
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
