import { Song, Stem, StemType } from '@/types';

// Helper to generate fake waveform data for visual display
export const generateMockWaveform = (length: number = 200): number[] => {
  const waveform: number[] = [];
  let value = 0.5;

  for (let i = 0; i < length; i++) {
    // Create somewhat realistic waveform patterns
    const change = (Math.random() - 0.5) * 0.3;
    value = Math.max(0.1, Math.min(0.9, value + change));

    // Add some rhythm patterns
    if (i % 10 < 3) {
      value = Math.min(0.95, value + 0.2);
    }

    waveform.push(value);
  }

  return waveform;
};

// Placeholder cover images from Unsplash
const covers = {
  pop: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  rnb: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
  soul: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
  jazz: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop',
  rock: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop',
  acoustic: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
  electronic: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop',
  classical: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
};

// Create stem templates
const createStems = (types: StemType[]): Stem[] => {
  const stemNames: Record<StemType, string> = {
    vocal: 'Lead Vocal',
    harmony: 'Harmony',
    instrumental: 'Instrumental',
    drums: 'Drums',
    bass: 'Bass',
    keys: 'Keys',
    other: 'Other',
  };

  return types.map((type, index) => ({
    id: `stem-${type}-${index}`,
    name: stemNames[type],
    type,
    url: '', // We'll use mock audio or leave empty for visual demo
    color: `hsl(var(--stem-${type}))`,
    waveformData: generateMockWaveform(200),
  }));
};

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Aurora Voice',
    coverArt: covers.pop,
    duration: 234,
    bpm: 120,
    key: 'C Major',
    fullMixUrl: '',
    stems: createStems(['vocal', 'harmony', 'instrumental', 'drums', 'bass']),
    difficulty: 'intermediate',
    genre: 'Pop',
    isPremium: false,
  },
  {
    id: '2',
    title: 'Soul River',
    artist: 'The Harmonics',
    coverArt: covers.soul,
    duration: 198,
    bpm: 85,
    key: 'G Minor',
    fullMixUrl: '',
    stems: createStems(['vocal', 'harmony', 'keys', 'bass']),
    difficulty: 'advanced',
    genre: 'Soul',
    isPremium: true,
  },
  {
    id: '3',
    title: 'Golden Hour',
    artist: 'Sunset Collective',
    coverArt: covers.acoustic,
    duration: 212,
    bpm: 92,
    key: 'D Major',
    fullMixUrl: '',
    stems: createStems(['vocal', 'instrumental', 'harmony']),
    difficulty: 'beginner',
    genre: 'Acoustic',
    isPremium: false,
  },
  {
    id: '4',
    title: 'Electric Nights',
    artist: 'Neon Pulse',
    coverArt: covers.electronic,
    duration: 276,
    bpm: 128,
    key: 'A Minor',
    fullMixUrl: '',
    stems: createStems(['vocal', 'instrumental', 'drums', 'bass', 'keys']),
    difficulty: 'intermediate',
    genre: 'Electronic',
    isPremium: true,
  },
  {
    id: '5',
    title: 'Velvet Smooth',
    artist: 'Jazz Trio',
    coverArt: covers.jazz,
    duration: 245,
    bpm: 72,
    key: 'Bb Major',
    fullMixUrl: '',
    stems: createStems(['vocal', 'keys', 'bass', 'drums']),
    difficulty: 'advanced',
    genre: 'Jazz',
    isPremium: true,
  },
  {
    id: '6',
    title: 'Rise Up',
    artist: 'Gospel Stars',
    coverArt: covers.rnb,
    duration: 189,
    bpm: 96,
    key: 'E Major',
    fullMixUrl: '',
    stems: createStems(['vocal', 'harmony', 'instrumental', 'drums']),
    difficulty: 'beginner',
    genre: 'R&B',
    isPremium: false,
  },
  {
    id: '7',
    title: 'Thunder Road',
    artist: 'Rock Legends',
    coverArt: covers.rock,
    duration: 298,
    bpm: 140,
    key: 'E Minor',
    fullMixUrl: '',
    stems: createStems(['vocal', 'instrumental', 'drums', 'bass']),
    difficulty: 'intermediate',
    genre: 'Rock',
    isPremium: false,
  },
  {
    id: '8',
    title: 'Nocturne',
    artist: 'Classical Ensemble',
    coverArt: covers.classical,
    duration: 312,
    bpm: 60,
    key: 'F Minor',
    fullMixUrl: '',
    stems: createStems(['vocal', 'instrumental', 'keys']),
    difficulty: 'advanced',
    genre: 'Classical',
    isPremium: true,
  },
];

// Quick access helpers
export const getFeaturedSongs = () => mockSongs.slice(0, 4);
export const getFreeSongs = () => mockSongs.filter((s) => !s.isPremium);
export const getPremiumSongs = () => mockSongs.filter((s) => s.isPremium);
export const getSongById = (id: string) => mockSongs.find((s) => s.id === id);

// Default stem states for mixer initialization
export const getDefaultStemStates = (stems: Stem[]) => {
  return stems.map((stem) => ({
    stemId: stem.id,
    volume: stem.type === 'vocal' ? 1.0 : 0.8,
    isMuted: false,
    isSolo: false,
    pan: 0,
  }));
};

// Mixer presets
export const mixerPresets = [
  {
    name: 'Vocals Only',
    description: 'Hear just the lead vocal',
    config: { vocal: 1, harmony: 0, instrumental: 0, drums: 0, bass: 0, keys: 0 },
  },
  {
    name: 'Karaoke',
    description: 'Instrumental without vocals',
    config: { vocal: 0, harmony: 0, instrumental: 1, drums: 1, bass: 1, keys: 1 },
  },
  {
    name: 'Practice',
    description: 'Lower vocals for sing-along',
    config: { vocal: 0.3, harmony: 1, instrumental: 0.8, drums: 0.5, bass: 0.5, keys: 0.8 },
  },
  {
    name: 'Full Mix',
    description: 'Everything at full volume',
    config: { vocal: 1, harmony: 1, instrumental: 1, drums: 1, bass: 1, keys: 1 },
  },
];
