// RVMT Types

export type StemType = 'vocal' | 'harmony' | 'instrumental' | 'drums' | 'bass' | 'keys' | 'other';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface Stem {
  id: string;
  name: string;
  type: StemType;
  url: string;
  color: string;
  waveformData?: number[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  duration: number;
  bpm?: number;
  key?: string;
  fullMixUrl: string;
  stems: Stem[];
  difficulty: Difficulty;
  genre: string;
  isPremium: boolean;
}

export interface StemState {
  stemId: string;
  volume: number;      // 0-1
  isMuted: boolean;
  isSolo: boolean;
  pan: number;         // -1 to 1
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLooping: boolean;
  loopStart: number;
  loopEnd: number;
  playbackRate: number;
}

export interface UserProgress {
  id: string;
  songId: string;
  timesPracticed: number;
  totalPracticeTime: number;
  lastPracticedAt: string | null;
  isFavorite: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string | null;
}

// Stem color mapping
export const STEM_COLORS: Record<StemType, string> = {
  vocal: 'hsl(var(--stem-vocal))',
  harmony: 'hsl(var(--stem-harmony))',
  instrumental: 'hsl(var(--stem-instrumental))',
  drums: 'hsl(var(--stem-drums))',
  bass: 'hsl(var(--stem-bass))',
  keys: 'hsl(var(--stem-keys))',
  other: 'hsl(var(--muted-foreground))',
};

// Stem icons (using lucide-react icon names)
export const STEM_ICONS: Record<StemType, string> = {
  vocal: 'Mic2',
  harmony: 'Music2',
  instrumental: 'Guitar',
  drums: 'Drum',
  bass: 'AudioWaveform',
  keys: 'Piano',
  other: 'Music',
};

// Playlist types
export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  songs?: PlaylistSong[];
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  added_at: string;
  song?: Song;
}
