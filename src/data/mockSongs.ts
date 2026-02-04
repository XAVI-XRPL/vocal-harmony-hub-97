import { Song, Stem, StemType } from '@/types';
import throwbackCover from '@/assets/throwback-exercise-cover.jpg';

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
  gospel: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=400&fit=crop',
};

// Use hex colors for proper inline style usage
const stemColors: Record<StemType, string> = {
  vocal: '#14b8a6',      // teal/cyan
  harmony: '#a855f7',    // purple
  instrumental: '#f59e0b', // amber
  drums: '#ef4444',      // red
  bass: '#8b5cf6',       // violet
  keys: '#10b981',       // green
  other: '#6b7280',      // gray
};

// Create stem templates with hex colors for proper CSS usage
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
    url: '', // Empty for mock songs
    color: stemColors[type],
    waveformData: generateMockWaveform(200),
  }));
};

// Real song: TESTIFY EXERCISE with actual audio stems
const testifyExerciseStems: Stem[] = [
  {
    id: 'testify-raab-coaching',
    name: 'RAab Coaching (Master)',
    type: 'vocal',
    url: '/audio/testify-exercise/raab-coaching.mp3',
    color: stemColors.vocal,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-instrumental',
    name: 'Instrumental',
    type: 'instrumental',
    url: '/audio/testify-exercise/instrumental.mp3',
    color: stemColors.instrumental,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-piano',
    name: 'Piano',
    type: 'keys',
    url: '/audio/testify-exercise/piano.mp3',
    color: stemColors.keys,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-guitar',
    name: 'Guitar',
    type: 'instrumental',
    url: '/audio/testify-exercise/guitar.mp3',
    color: '#f97316',
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-raab-exercise',
    name: 'RAab Exercise (Lead)',
    type: 'vocal',
    url: '/audio/testify-exercise/raab-exercise.mp3',
    color: '#22d3ee',
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-jlevy-exercise',
    name: 'JLevy Exercise 1',
    type: 'vocal',
    url: '/audio/testify-exercise/jlevy-exercise-1.mp3',
    color: '#06b6d4',
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-raab-harmony-2',
    name: 'RAab Harmony 2',
    type: 'harmony',
    url: '/audio/testify-exercise/raab-harmony-2.mp3',
    color: stemColors.harmony,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-jlevy-harmony-2',
    name: 'JLevy Harmony 2',
    type: 'harmony',
    url: '/audio/testify-exercise/jlevy-harmony-2.mp3',
    color: '#c084fc',
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'testify-raab-harmony-3',
    name: 'RAab Harmony 3',
    type: 'harmony',
    url: '/audio/testify-exercise/raab-harmony-3.mp3',
    color: '#e879f9',
    waveformData: generateMockWaveform(200),
  },
];

// Real song: THROWBACK EXERCISE with actual audio stems
const throwbackExerciseStems: Stem[] = [
  {
    id: 'throwback-raab-coaching',
    name: 'RAab Coaching (Master)',
    type: 'vocal',
    url: '/audio/throwback-exercise/raab-coaching.mp3',
    color: stemColors.vocal,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'throwback-instrumental',
    name: 'Instrumental',
    type: 'instrumental',
    url: '/audio/throwback-exercise/instrumental.mp3',
    color: stemColors.instrumental,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'throwback-piano',
    name: 'Piano',
    type: 'keys',
    url: '/audio/throwback-exercise/piano.mp3',
    color: stemColors.keys,
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'throwback-guitar',
    name: 'Guitar',
    type: 'instrumental',
    url: '/audio/throwback-exercise/guitar.mp3',
    color: '#f97316',
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'throwback-raab-exercise',
    name: 'RAab Exercise (Lead)',
    type: 'vocal',
    url: '/audio/throwback-exercise/raab-exercise.mp3',
    color: '#22d3ee',
    waveformData: generateMockWaveform(200),
  },
  {
    id: 'throwback-jlevy-exercise',
    name: 'JLevy Exercise 1',
    type: 'vocal',
    url: '/audio/throwback-exercise/jlevy-exercise-1.mp3',
    color: '#06b6d4',
    waveformData: generateMockWaveform(200),
  },
];

export const mockSongs: Song[] = [
  // Real song with actual audio
  {
    id: 'testify-exercise',
    title: '1. TESTIFY EXERCISE',
    artist: 'RVMT',
    coverArt: covers.gospel,
    duration: 180,
    bpm: 90,
    key: 'G Major',
    fullMixUrl: '',
    stems: testifyExerciseStems,
    difficulty: 'beginner',
    genre: 'Gospel',
    isPremium: false,
  },
  {
    id: 'throwback-exercise',
    title: '2. THROWBACK EXERCISE',
    artist: 'RVMT',
    coverArt: throwbackCover,
    duration: 180,
    bpm: 95,
    key: 'C Major',
    fullMixUrl: '',
    stems: throwbackExerciseStems,
    difficulty: 'beginner',
    genre: 'Gospel',
    isPremium: false,
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
