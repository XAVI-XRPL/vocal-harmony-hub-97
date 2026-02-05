/**
 * useAudioEngine Hook
 * 
 * React hook that bridges the WebAudioEngine singleton to React component state.
 * Provides reactive state updates and control callbacks.
 */

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { webAudioEngine, EngineState, SongConfig, StemLoadProgress } from '@/services/webAudioEngine';
import { useAudioStore } from '@/stores/audioStore';

interface UseAudioEngineReturn {
  // State
  playbackState: EngineState['playbackState'];
  audioMode: EngineState['audioMode'];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isLoaded: boolean;
  isReadyToPlay: boolean;
  isBuffering: boolean;
  loadingProgress: number;
  bufferedCount: number;
  totalStemCount: number;
  stemLoadProgress: StemLoadProgress[];
  hasRealAudio: boolean;
  mixdownReady: boolean;
  allStemsReady: boolean;
  mixdownProgress: number;

  // Controls
  init: () => Promise<void>;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  stop: () => void;

  // Stem controls
  setStemVolume: (stemId: string, volume: number) => void;
  setStemMuted: (stemId: string, muted: boolean) => void;
  setStemSolo: (stemId: string, solo: boolean) => void;
  setMasterMuted: (muted: boolean) => void;

  // Loop controls
  setLoop: (start: number, end: number) => void;
  toggleLoop: () => void;
  clearLoop: () => void;

  // Playback rate
  setPlaybackRate: (rate: number) => void;
}

export function useAudioEngine(): UseAudioEngineReturn {
  const currentSong = useAudioStore((state) => state.currentSong);

  // Track if we have real audio stems
  const hasRealAudio = currentSong?.stems.some((stem) => stem.url && stem.url.length > 0) ?? false;

  // Subscribe to engine state using useSyncExternalStore for React 18 compatibility.
  // IMPORTANT: webAudioEngine.getState() must return a referentially-stable snapshot.
  const engineState = useSyncExternalStore(
    useCallback((onStoreChange) => webAudioEngine.subscribeOnChange(onStoreChange), []),
    () => webAudioEngine.getState(),
    () => webAudioEngine.getState(),
  );

  // Keep audio store in sync with engine state WITHOUT updating during render.
  // (Updating Zustand during render can trigger React nested update / infinite loops.)
  const prevTimeRef = useRef<number>(0);
  const prevDurationRef = useRef<number>(0);

  useEffect(() => {
    if (Math.abs(engineState.currentTime - prevTimeRef.current) > 0.05) {
      prevTimeRef.current = engineState.currentTime;
      useAudioStore.getState().updateCurrentTime(engineState.currentTime);
    }
  }, [engineState.currentTime]);

  useEffect(() => {
    if (engineState.duration > 0 && engineState.duration !== prevDurationRef.current) {
      prevDurationRef.current = engineState.duration;
      useAudioStore.getState().setDuration(engineState.duration);
    }
  }, [engineState.duration]);

  // Load song when currentSong changes
  const prevSongIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentSong || currentSong.id === prevSongIdRef.current) return;

    prevSongIdRef.current = currentSong.id;

    // Only load if song has real audio
    const stemsWithAudio = currentSong.stems.filter((stem) => stem.url && stem.url.length > 0);
    if (stemsWithAudio.length === 0) {
      console.log('No audio stems for this song');
      return;
    }

    const songConfig: SongConfig = {
      songId: currentSong.id,
      mixdownUrl: currentSong.fullMixUrl || undefined,
      stems: stemsWithAudio.map((stem) => ({
        id: stem.id,
        name: stem.name,
        url: stem.url,
        color: stem.color,
        type: stem.type,
      })),
      duration: currentSong.duration,
    };

    // Load song directly - don't call init() here as it needs user gesture
    // Loading can happen with AudioContext suspended
    webAudioEngine.loadSong(songConfig);

    return () => {
      // Don't cleanup on unmount - let engine persist
    };
  }, [currentSong?.id]);

  // Calculate derived state
  const loadedStems = engineState.stemLoadProgress.filter((s) => s.loaded).length;
  const totalStems = engineState.stemLoadProgress.length;
  const loadingProgress = totalStems > 0 ? (loadedStems / totalStems) * 100 : 0;

  const isLoaded = engineState.playbackState !== 'idle' && engineState.playbackState !== 'loading';
  // Can play if mixdown is ready (even if still loading stems) or if fully ready
  const isReadyToPlay =
    engineState.playbackState === 'ready' ||
    engineState.playbackState === 'playing' ||
    engineState.playbackState === 'paused' ||
    engineState.mixdownReady;
  const isBuffering = engineState.playbackState === 'loading' && !engineState.mixdownReady;
  const isPlaying = engineState.playbackState === 'playing';

  // Control callbacks
  const init = useCallback(async () => {
    await webAudioEngine.init();
  }, []);

  const play = useCallback(() => {
    webAudioEngine.play();
    useAudioStore.getState().play();
  }, []);

  const pause = useCallback(() => {
    webAudioEngine.pause();
    useAudioStore.getState().pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seekTo = useCallback((time: number) => {
    webAudioEngine.seek(time);
    useAudioStore.getState().seek(time);
  }, []);

  const stop = useCallback(() => {
    webAudioEngine.stop();
    useAudioStore.getState().pause();
    useAudioStore.getState().seek(0);
  }, []);

  const setStemVolume = useCallback((stemId: string, volume: number) => {
    webAudioEngine.setStemVolume(stemId, volume);
    useAudioStore.getState().setStemVolume(stemId, volume);
  }, []);

  const setStemMuted = useCallback((stemId: string, muted: boolean) => {
    webAudioEngine.setStemMuted(stemId, muted);
    // Toggle in store (store uses toggle, engine uses set)
    const stemState = useAudioStore.getState().stemStates.find((s) => s.stemId === stemId);
    if (stemState && stemState.isMuted !== muted) {
      useAudioStore.getState().toggleStemMute(stemId);
    }
  }, []);

  const setStemSolo = useCallback((stemId: string, solo: boolean) => {
    webAudioEngine.setStemSolo(stemId, solo);
    // Toggle in store
    const stemState = useAudioStore.getState().stemStates.find((s) => s.stemId === stemId);
    if (stemState && stemState.isSolo !== solo) {
      useAudioStore.getState().toggleStemSolo(stemId);
    }
  }, []);

  const setMasterMuted = useCallback((muted: boolean) => {
    webAudioEngine.setMasterMuted(muted);
    useAudioStore.getState().toggleMasterMute();
  }, []);

  const setLoop = useCallback((start: number, end: number) => {
    webAudioEngine.setLoop(start, end);
    useAudioStore.getState().setLoop(start, end);
  }, []);

  const toggleLoop = useCallback(() => {
    webAudioEngine.toggleLoop();
    useAudioStore.getState().toggleLoop();
  }, []);

  const clearLoop = useCallback(() => {
    webAudioEngine.clearLoop();
    useAudioStore.getState().clearLoop();
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    webAudioEngine.setPlaybackRate(rate);
    useAudioStore.getState().setPlaybackRate(rate);
  }, []);

  return {
    // State
    playbackState: engineState.playbackState,
    audioMode: engineState.audioMode,
    currentTime: engineState.currentTime,
    duration: engineState.duration,
    isPlaying,
    isLoaded,
    isReadyToPlay,
    isBuffering,
    loadingProgress,
    bufferedCount: loadedStems,
    totalStemCount: totalStems,
    stemLoadProgress: engineState.stemLoadProgress,
    hasRealAudio,
    mixdownReady: engineState.mixdownReady,
    allStemsReady: engineState.allStemsReady,
    mixdownProgress: engineState.mixdownProgress,

    // Controls
    init,
    play,
    pause,
    togglePlayPause,
    seekTo,
    stop,

    // Stem controls
    setStemVolume,
    setStemMuted,
    setStemSolo,
    setMasterMuted,

    // Loop controls
    setLoop,
    toggleLoop,
    clearLoop,

    // Playback rate
    setPlaybackRate,
  };
}

