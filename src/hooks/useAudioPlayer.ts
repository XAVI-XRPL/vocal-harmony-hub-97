import { useEffect, useRef, useCallback, useState } from 'react';
import { Howl } from 'howler';
import { useAudioStore } from '@/stores/audioStore';
import { Song, Stem } from '@/types';

interface StemHowl {
  stemId: string;
  howl: Howl;
}

// Delay to allow HTML5 audio buffers to stabilize after seeking
const SEEK_SYNC_DELAY_MS = 50;
// Maximum acceptable drift between stems (in seconds)
const SYNC_TOLERANCE_SEC = 0.1;

export function useAudioPlayer() {
  const stemHowlsRef = useRef<StemHowl[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isSeekingRef = useRef(false);
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

  // Clean up all Howl instances
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
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
          // Handle song end
          if (!isLooping) {
            pause();
            updateCurrentTime(0);
          }
        },
      });

      stemHowlsRef.current.push({ stemId: stem.id, howl });
    });
  }, [cleanup, setDuration, isLooping, pause, updateCurrentTime]);

  // Load song when it changes
  useEffect(() => {
    if (currentSong) {
      loadSong(currentSong);
    }
    
    return () => cleanup();
  }, [currentSong?.id]); // Only reload when song ID changes

  // Play/Pause control
  useEffect(() => {
    if (!isLoaded || stemHowlsRef.current.length === 0) return;

    if (isPlaying) {
      // Start all stems from current position
      stemHowlsRef.current.forEach(({ howl }) => {
        if (!howl.playing()) {
          howl.seek(currentTime);
          howl.play();
        }
      });

      // Start the animation frame loop to update time
      const updateTime = () => {
        // Don't update time while seeking
        if (isSeekingRef.current) {
          animationFrameRef.current = requestAnimationFrame(updateTime);
          return;
        }

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
            
            // Handle looping with synchronized seek
            if (isLooping && loopEnd > loopStart) {
              if (time >= loopEnd) {
                // Use synchronized seek for loop boundary
                stemHowlsRef.current.forEach(({ howl }) => {
                  howl.pause();
                });
                stemHowlsRef.current.forEach(({ howl }) => {
                  howl.seek(loopStart);
                });
                setTimeout(() => {
                  stemHowlsRef.current.forEach(({ howl }) => {
                    howl.play();
                  });
                }, SEEK_SYNC_DELAY_MS);
                updateCurrentTime(loopStart);
              } else {
                updateCurrentTime(time);
              }
            } else {
              updateCurrentTime(time);
            }
          }
        }
        
        if (isPlaying) {
          animationFrameRef.current = requestAnimationFrame(updateTime);
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      // Pause all stems
      stemHowlsRef.current.forEach(({ howl }) => {
        howl.pause();
      });

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isLoaded, isLooping, loopStart, loopEnd]);

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

  // Synchronized seek - pauses all stems, seeks, then resumes together
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

    // 2. Pause all stems immediately
    stemHowlsRef.current.forEach(({ howl }) => {
      if (howl.playing()) {
        howl.pause();
      }
    });

    // 3. Seek all stems to the target time
    stemHowlsRef.current.forEach(({ howl }) => {
      howl.seek(time);
    });

    // 4. Update the store immediately for UI responsiveness
    updateCurrentTime(time);

    // 5. Wait for HTML5 audio buffers to stabilize, then resume if was playing
    setTimeout(() => {
      // Verify all stems are in sync (within tolerance)
      const positions = stemHowlsRef.current.map(({ howl }) => howl.seek() as number);
      const minPos = Math.min(...positions);
      const maxPos = Math.max(...positions);
      
      // If stems drifted, re-seek the outliers
      if (maxPos - minPos > SYNC_TOLERANCE_SEC) {
        console.log('Correcting stem drift after seek');
        stemHowlsRef.current.forEach(({ howl }) => {
          howl.seek(time);
        });
      }

      // Resume playback if was playing before seek
      if (wasPlaying) {
        stemHowlsRef.current.forEach(({ howl }) => {
          howl.play();
        });
      }

      isSeekingRef.current = false;
    }, SEEK_SYNC_DELAY_MS);
  }, [updateCurrentTime]);

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
