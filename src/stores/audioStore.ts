import { create } from 'zustand';
import { Song, StemState, PlaybackState } from '@/types';
import { getDefaultStemStates } from '@/data/mockSongs';

interface AudioStore {
  // Current song
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;

  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setDuration: (duration: number) => void;
  updateCurrentTime: (time: number) => void;

  // Stem states
  stemStates: StemState[];
  setStemVolume: (stemId: string, volume: number) => void;
  toggleStemMute: (stemId: string) => void;
  toggleStemSolo: (stemId: string) => void;
  toggleMasterMute: () => void;
  resetMixer: () => void;
  initializeStemStates: (song: Song) => void;

  // Loop
  isLooping: boolean;
  loopStart: number;
  loopEnd: number;
  setLoop: (start: number, end: number) => void;
  toggleLoop: () => void;
  clearLoop: () => void;

  // View mode
  viewMode: 'full' | 'stems';
  setViewMode: (mode: 'full' | 'stems') => void;

  // Playback rate
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  // Current song
  currentSong: null,
  setCurrentSong: (song) => {
    set({ currentSong: song, currentTime: 0, isPlaying: false });
    if (song) {
      get().initializeStemStates(song);
      set({ duration: song.duration });
    }
  },

  // Playback state
  isPlaying: false,
  currentTime: 0,
  duration: 0,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  seek: (time) => set({ currentTime: Math.max(0, Math.min(time, get().duration)) }),
  setDuration: (duration) => set({ duration }),
  updateCurrentTime: (time) => set({ currentTime: time }),

  // Stem states
  stemStates: [],
  
  initializeStemStates: (song) => {
    const states = getDefaultStemStates(song.stems);
    set({ stemStates: states });
  },

  setStemVolume: (stemId, volume) =>
    set((state) => ({
      stemStates: state.stemStates.map((s) =>
        s.stemId === stemId ? { ...s, volume } : s
      ),
    })),

  toggleStemMute: (stemId) =>
    set((state) => ({
      stemStates: state.stemStates.map((s) =>
        s.stemId === stemId ? { ...s, isMuted: !s.isMuted } : s
      ),
    })),

  toggleStemSolo: (stemId) =>
    set((state) => {
      const currentStem = state.stemStates.find((s) => s.stemId === stemId);
      const isCurrentlySolo = currentStem?.isSolo || false;

      // If turning off solo, check if any other stems are solo'd
      if (isCurrentlySolo) {
        return {
          stemStates: state.stemStates.map((s) =>
            s.stemId === stemId ? { ...s, isSolo: false } : s
          ),
        };
      }

      // If turning on solo
      return {
        stemStates: state.stemStates.map((s) =>
          s.stemId === stemId ? { ...s, isSolo: true } : s
        ),
      };
    }),

  toggleMasterMute: () =>
    set((state) => {
      const allMuted = state.stemStates.every((s) => s.isMuted);
      return {
        stemStates: state.stemStates.map((s) => ({
          ...s,
          isMuted: !allMuted,
        })),
      };
    }),

  resetMixer: () =>
    set((state) => {
      if (!state.currentSong) return state;
      return { stemStates: getDefaultStemStates(state.currentSong.stems) };
    }),

  // Loop
  isLooping: false,
  loopStart: 0,
  loopEnd: 0,

  setLoop: (start, end) => set({ loopStart: start, loopEnd: end, isLooping: true }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  clearLoop: () => set({ isLooping: false, loopStart: 0, loopEnd: 0 }),

  // View mode
  viewMode: 'full',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Playback rate
  playbackRate: 1,
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
}));

// Helper hook to get effective volume for a stem (considering solo/mute)
export const useEffectiveStemVolume = (stemId: string) => {
  const stemStates = useAudioStore((state) => state.stemStates);
  const stem = stemStates.find((s) => s.stemId === stemId);
  
  if (!stem) return 0;
  if (stem.isMuted) return 0;

  // Check if any stem is solo'd
  const hasSoloedStems = stemStates.some((s) => s.isSolo);
  
  if (hasSoloedStems && !stem.isSolo) return 0;
  
  return stem.volume;
};
