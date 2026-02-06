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

export type StemGroupLoadBehavior = 'immediate' | 'lazy';

export interface StemGroup {
  id: string;
  name: string;
  loadBehavior: StemGroupLoadBehavior;
  stems: Stem[];
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
  stemGroups: StemGroup[];
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

// ========== V2.0 Hub Module Types ==========

// Vocal Rider Store
export type ProductCategory = 
  | 'throat-care' 
  | 'hydration' 
  | 'essential-oils' 
  | 'tea-honey' 
  | 'nasal-sinus' 
  | 'allergy-wellness' 
  | 'accessories';

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  affiliateUrl: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  tags: string[];
  discountCode?: string;
  isComingSoon?: boolean;
  isPartnerBrand?: boolean;
}

// Vocal Health Directory
export interface City {
  id: string;
  name: string;
  state: string;
  abbreviation: string;
  svgX: number;  // X coordinate on USA map SVG (0-100 scale)
  svgY: number;  // Y coordinate on USA map SVG (0-100 scale)
  venueCount: number;
  doctorCount: number;
}

// Re-export StateData for convenience
export type { StateData } from "@/data/usStateData";

export type DoctorSpecialty = 'ENT' | 'Laryngologist' | 'Voice Therapist' | 'Vocal Coach';

export interface Doctor {
  id: string;
  name: string;
  credentials: string;
  specialty: DoctorSpecialty;
  practice: string;
  cityId: string;
  address: string;
  phone: string;
  website: string;
  bio: string;
  imageUrl: string;
  acceptsEmergency: boolean;
  touringArtistFriendly: boolean;
  rating: number;
  reviewCount: number;
}

export interface Venue {
  id: string;
  name: string;
  type: 'arena' | 'stadium' | 'theater' | 'club';
  cityId: string;
  address: string;
  capacity: number;
  imageUrl: string;
}

// Stage Prep
export interface PartnerBrand {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  discountCode: string;
  discountPercent: number;
  websiteUrl: string;
}

export type GearCategory = 'iem' | 'microphone' | 'in-ear-monitor' | 'cable' | 'case' | 'accessories';

export interface GearProduct {
  id: string;
  name: string;
  brandId: string;
  category: GearCategory;
  description: string;
  price: number;
  imageUrl: string;
  affiliateUrl: string;
  isFeatured: boolean;
  specs: Record<string, string>;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'vocal' | 'gear' | 'mental' | 'physical';
  description: string;
  order: number;
}
