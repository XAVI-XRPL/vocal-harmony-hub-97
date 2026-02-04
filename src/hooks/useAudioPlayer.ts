import { useEffect, useRef, useCallback, useState } from 'react';
import { Howl } from 'howler';
import { useAudioStore } from '@/stores/audioStore';
import { Song, Stem } from '@/types';

interface StemHowl {
  stemId: string;
  howl: Howl;
}

// Delay to allow HTML5 audio buffers to stabilize after seeking
const SEEK_SYNC_DELAY_MS = 150;
// Maximum acceptable drift between stems (in seconds)
const SYNC_TOLERANCE_SEC = 0.08;
// Maximum retry attempts for sync correction
const MAX_SYNC_RETRIES = 3;
// Interval for checking drift during playback (ms)
const DRIFT_CHECK_INTERVAL_MS = 1000;
// Minimum drift required to trigger correction (prevents overcorrection)
const DRIFT_CORRECTION_THRESHOLD = 0.15;
// Minimum time between corrections to allow stabilization
const MIN_CORRECTION_INTERVAL_MS = 2000;

export function useAudioPlayer() {
  const stemHowlsRef = useRef<StemHowl[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const driftCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSeekingRef = useRef(false);
  const lastDriftCorrectionRef = useRef<number>(0);
  // Master clock references for accurate position tracking
  const playbackStartTimeRef = useRef<number>(0);
  const playbackStartPositionRef = useRef<number>(0);
  // Flag to track when playback resumes from a seek (to avoid stale closure issue)
  const seekResumeRef = useRef(false);
  // Flag to track previous playing state - prevents re-syncing when only loop values change
  const wasPlayingRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const {
    currentSong,
    isPlaying,
    currentTime,
    stemStates,
    isLooping,
    loopStart,
    loopEnd,
    playbackRate,
    updateCurrentTime,
    setDuration,
    pause,
  } = useAudioStore();

  // Calculate expected position based on wall-clock time (master clock)
  // Uses refs to avoid re-render cascades - reads store state directly when needed
  const getExpectedPosition = useCallback((): number => {
    const state = useAudioStore.getState();
    if (!state.isPlaying) return playbackStartPositionRef.current;
    const elapsed = (Date.now() - playbackStartTimeRef.current) / 1000;
    return playbackStartPositionRef.current + (elapsed * state.playbackRate);
  }, []);

  // Helper to verify all stems are synchronized
  const verifyStemSync = useCallback((targetTime: number): boolean => {
    if (stemHowlsRef.current.length === 0) return true;
    
    const positions = stemHowlsRef.current
      .map(({ howl }) => howl.seek() as number)
      .filter(pos => typeof pos === 'number' && !isNaN(pos));
    
    if (positions.length === 0) return true;
    
    const minPos = Math.min(...positions);
    const maxPos = Math.max(...positions);
    const spread = maxPos - minPos;
    
    return spread <= SYNC_TOLERANCE_SEC;
  }, []);

  // Helper to re-seek all stems to a target time
  const reSeekAllStems = useCallback((time: number) => {
    stemHowlsRef.current.forEach(({ howl }) => {
      howl.seek(time);
    });
  }, []);

  // Helper for synchronized playback start
  const syncPlay = useCallback((targetTime: number) => {
    // First ensure all stems are at the same position
    reSeekAllStems(targetTime);
    
    // Record master clock reference
    playbackStartTimeRef.current = Date.now();
    playbackStartPositionRef.current = targetTime;
    
    // Start all stems in rapid succession
    stemHowlsRef.current.forEach(({ howl }) => {
      howl.play();
    });
  }, [reSeekAllStems]);

  // Correct drift during playback - improved strategy to prevent overcorrection
  const correctDrift = useCallback(() => {
    if (isSeekingRef.current || stemHowlsRef.current.length === 0) return;
    
    const now = Date.now();
    // Prevent too frequent corrections - use longer debounce
    if (now - lastDriftCorrectionRef.current < MIN_CORRECTION_INTERVAL_MS) return;
    
    const positions = stemHowlsRef.current
      .map(({ howl }) => howl.seek() as number)
      .filter(pos => typeof pos === 'number' && !isNaN(pos));
    
    if (positions.length < 2) return;
    
    const minPos = Math.min(...positions);
    const maxPos = Math.max(...positions);
    const spread = maxPos - minPos;
    
    // Only correct significant drift (prevents overcorrection loops)
    if (spread > DRIFT_CORRECTION_THRESHOLD) {
      console.log(`Significant drift detected: ${spread.toFixed(3)}s, correcting...`);
      lastDriftCorrectionRef.current = now;
      
      // Calculate expected position from master clock for accuracy
      const expectedPos = getExpectedPosition();
      
      // Pause all stems briefly for clean correction
      stemHowlsRef.current.forEach(({ howl }) => {
        howl.pause();
      });
      
      // Re-seek all to expected position
      reSeekAllStems(expectedPos);
      
      // Longer delay before resuming to allow buffers to stabilize
      setTimeout(() => {
        if (useAudioStore.getState().isPlaying) {
          // Reset master clock to current position
          playbackStartTimeRef.current = Date.now();
          playbackStartPositionRef.current = expectedPos;
          
          // Start all stems together
          stemHowlsRef.current.forEach(({ howl }) => {
            howl.play();
          });
        }
      }, 100);
    }
  }, [reSeekAllStems, getExpectedPosition]);

  // Clean up all Howl instances
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (driftCheckIntervalRef.current) {
      clearInterval(driftCheckIntervalRef.current);
      driftCheckIntervalRef.current = null;
    }
    
    stemHowlsRef.current.forEach(({ howl }) => {
      howl.stop();
      howl.unload();
    });
    stemHowlsRef.current = [];
    setIsLoaded(false);
    setLoadingProgress(0);
  }, []);

  // Load stems for a song
  const loadSong = useCallback((song: Song) => {
    cleanup();
    
    // Filter stems that have actual URLs
    const stemsWithAudio = song.stems.filter(stem => stem.url && stem.url.length > 0);
    
    if (stemsWithAudio.length === 0) {
      console.log('No audio stems found for this song (mock song)');
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalStems = stemsWithAudio.length;

    stemsWithAudio.forEach((stem) => {
      const howl = new Howl({
        src: [stem.url],
        html5: true, // Use HTML5 for better streaming
        preload: true,
        volume: 0.8,
        onload: () => {
          loadedCount++;
          setLoadingProgress((loadedCount / totalStems) * 100);
          
          // When first stem loads, set duration
          if (loadedCount === 1) {
            const duration = howl.duration();
            if (duration > 0) {
              setDuration(duration);
            }
          }
          
          if (loadedCount === totalStems) {
            setIsLoaded(true);
            console.log('All stems loaded!');
          }
        },
        onloaderror: (id, error) => {
          console.error(`Error loading stem ${stem.name}:`, error);
          loadedCount++;
          setLoadingProgress((loadedCount / totalStems) * 100);
          
          if (loadedCount === totalStems) {
            setIsLoaded(true);
          }
        },
        onend: () => {
          // Handle song end - read fresh state to avoid stale closure
          const state = useAudioStore.getState();
          if (!state.isLooping) {
            state.pause();
            state.updateCurrentTime(0);
          }
        },
      });

      stemHowlsRef.current.push({ stemId: stem.id, howl });
    });
  }, [cleanup, setDuration]);

  // Load song when it changes
  useEffect(() => {
    if (currentSong) {
      loadSong(currentSong);
    }
    
    return () => cleanup();
  }, [currentSong?.id]); // Only reload when song ID changes

  // Play/Pause control with drift checking
  useEffect(() => {
    if (!isLoaded || stemHowlsRef.current.length === 0) return;

    if (isPlaying) {
      // Skip syncPlay if we just resumed from a seek - the seekTo function already
      // set the correct position and started playback
      if (seekResumeRef.current) {
        seekResumeRef.current = false;
        // Just continue to start the animation frame loop, don't re-seek
      } else if (!wasPlayingRef.current) {
        // Only sync when truly transitioning from paused to playing
        // This prevents re-syncing when only loop values change during playback
        syncPlay(playbackStartPositionRef.current);
      }
      // If wasPlayingRef.current is already true, we're re-running due to
      // loop value changes - don't interrupt ongoing playback

      wasPlayingRef.current = true;

      // Start the animation frame loop to update time
      const updateTime = () => {
        // Don't update time while seeking
        if (isSeekingRef.current) {
          animationFrameRef.current = requestAnimationFrame(updateTime);
          return;
        }

        // Read state directly from store to avoid stale closures and React queue errors
        const state = useAudioStore.getState();

        if (stemHowlsRef.current.length > 0) {
          // Read position from multiple stems and use median for accuracy
          const positions = stemHowlsRef.current
            .map(({ howl }) => howl.seek() as number)
            .filter(pos => typeof pos === 'number' && !isNaN(pos));
          
          if (positions.length > 0) {
            // Use median position for more stable time tracking
            positions.sort((a, b) => a - b);
            const medianIndex = Math.floor(positions.length / 2);
            const time = positions[medianIndex];
            
            // Handle looping with immediate seek (no pause/resume for smoother loops)
            if (state.isLooping && state.loopEnd > state.loopStart) {
              if (time >= state.loopEnd) {
                // Immediate seek without pause cycle - all stems jump to loop start
                stemHowlsRef.current.forEach(({ howl }) => {
                  howl.seek(state.loopStart);
                });
                
                // Reset master clock to prevent drift accumulation
                playbackStartTimeRef.current = Date.now();
                playbackStartPositionRef.current = state.loopStart;
                
                state.updateCurrentTime(state.loopStart);
              } else {
                state.updateCurrentTime(time);
                // Keep master clock in sync during playback for accurate position tracking
                playbackStartTimeRef.current = Date.now();
                playbackStartPositionRef.current = time;
              }
            } else {
              state.updateCurrentTime(time);
              // Keep master clock in sync during playback for accurate position tracking
              playbackStartTimeRef.current = Date.now();
              playbackStartPositionRef.current = time;
            }
          }
        }
        
        // Check if still playing from store state
        if (state.isPlaying) {
          animationFrameRef.current = requestAnimationFrame(updateTime);
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateTime);
      
      // Start drift correction interval
      driftCheckIntervalRef.current = setInterval(correctDrift, DRIFT_CHECK_INTERVAL_MS);
    } else {
      // Reset playing state tracking when paused
      wasPlayingRef.current = false;
      
      // Pause all stems
      stemHowlsRef.current.forEach(({ howl }) => {
        howl.pause();
      });

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (driftCheckIntervalRef.current) {
        clearInterval(driftCheckIntervalRef.current);
        driftCheckIntervalRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (driftCheckIntervalRef.current) {
        clearInterval(driftCheckIntervalRef.current);
      }
    };
  }, [isPlaying, isLoaded, syncPlay, correctDrift]);

  // Update stem volumes based on stemStates
  useEffect(() => {
    if (!isLoaded) return;

    const hasSoloedStems = stemStates.some(s => s.isSolo);

    stemHowlsRef.current.forEach(({ stemId, howl }) => {
      const state = stemStates.find(s => s.stemId === stemId);
      if (!state) return;

      let effectiveVolume = state.volume;
      
      // Apply mute
      if (state.isMuted) {
        effectiveVolume = 0;
      }
      // Apply solo logic
      else if (hasSoloedStems && !state.isSolo) {
        effectiveVolume = 0;
      }

      howl.volume(effectiveVolume);
    });
  }, [stemStates, isLoaded]);

  // Update playback rate
  useEffect(() => {
    if (!isLoaded) return;

    stemHowlsRef.current.forEach(({ howl }) => {
      howl.rate(playbackRate);
    });
  }, [playbackRate, isLoaded]);

  // Synchronized seek with retry logic
  const seekTo = useCallback((time: number) => {
    // Prevent race conditions from rapid seeking
    if (isSeekingRef.current) return;
    if (stemHowlsRef.current.length === 0) {
      updateCurrentTime(time);
      return;
    }

    isSeekingRef.current = true;

    // Check if currently playing
    const wasPlaying = stemHowlsRef.current.some(({ howl }) => howl.playing());

    // 1. Cancel animation frame to stop time updates during seek
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // 2. Clear drift check interval
    if (driftCheckIntervalRef.current) {
      clearInterval(driftCheckIntervalRef.current);
      driftCheckIntervalRef.current = null;
    }

    // 3. Pause all stems immediately
    stemHowlsRef.current.forEach(({ howl }) => {
      if (howl.playing()) {
        howl.pause();
      }
    });

    // 4. Seek all stems to the target time
    reSeekAllStems(time);

    // 5. Update the store immediately for UI responsiveness
    updateCurrentTime(time);

    // 6. Wait and verify sync with retries
    const attemptSync = (attempt: number) => {
      setTimeout(() => {
        if (!verifyStemSync(time) && attempt < MAX_SYNC_RETRIES) {
          console.log(`Sync attempt ${attempt + 1} failed, retrying...`);
          reSeekAllStems(time);
          attemptSync(attempt + 1);
        } else {
          // Sync verified or max retries reached
          if (attempt >= MAX_SYNC_RETRIES) {
            console.log('Max sync retries reached, proceeding anyway');
          }
          
          // Resume playback if was playing before seek
          if (wasPlaying) {
            // Set master clock BEFORE resuming to ensure correct position
            playbackStartTimeRef.current = Date.now();
            playbackStartPositionRef.current = time;
            // Mark that we're resuming from seek - this prevents the isPlaying effect
            // from calling syncPlay() with a stale currentTime value
            seekResumeRef.current = true;
            
            stemHowlsRef.current.forEach(({ howl }) => {
              howl.play();
            });
          }

          isSeekingRef.current = false;
        }
      }, SEEK_SYNC_DELAY_MS);
    };
    
    attemptSync(0);
  }, [updateCurrentTime, verifyStemSync, reSeekAllStems]);

  // Expose seekTo for external use
  useEffect(() => {
    // Store seekTo in a way that can be accessed
    (window as any).__audioPlayerSeek = seekTo;
    
    return () => {
      delete (window as any).__audioPlayerSeek;
    };
  }, [seekTo]);

  return {
    isLoaded,
    loadingProgress,
    seekTo,
    hasRealAudio: stemHowlsRef.current.length > 0,
  };
}
