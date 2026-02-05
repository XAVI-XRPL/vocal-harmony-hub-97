import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Song, Stem, StemType, Difficulty } from '@/types';

// Helper to generate fake waveform data for visual display
const generateMockWaveform = (length: number = 200): number[] => {
  const waveform: number[] = [];
  let value = 0.5;

  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.5) * 0.3;
    value = Math.max(0.1, Math.min(0.9, value + change));
    if (i % 10 < 3) {
      value = Math.min(0.95, value + 0.2);
    }
    waveform.push(value);
  }

  return waveform;
};

interface DbStem {
  id: string;
  song_id: string;
  name: string;
  type: string;
  audio_path: string;
  color: string;
  position: number;
}

interface DbSong {
  id: string;
  title: string;
  artist: string;
  cover_art: string;
  duration: number;
  bpm: number | null;
  key: string | null;
  difficulty: string;
  genre: string;
  is_premium: boolean;
  full_mix_url: string | null;
  stems: DbStem[];
}

// Transform database song to frontend Song type
const transformSong = (dbSong: DbSong): Song => {
  const stems: Stem[] = (dbSong.stems || [])
    .sort((a, b) => a.position - b.position)
    .map((stem) => ({
      id: stem.id,
      name: stem.name,
      type: stem.type as StemType,
      url: stem.audio_path,
      color: stem.color,
      waveformData: generateMockWaveform(200),
    }));

  return {
    id: dbSong.id,
    title: dbSong.title,
    artist: dbSong.artist,
    coverArt: dbSong.cover_art,
    duration: dbSong.duration,
    bpm: dbSong.bpm ?? undefined,
    key: dbSong.key ?? undefined,
    fullMixUrl: dbSong.full_mix_url || '',
    stems,
    difficulty: dbSong.difficulty as Difficulty,
    genre: dbSong.genre,
    isPremium: dbSong.is_premium,
  };
};

export function useSongs() {
  return useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data: songs, error } = await supabase
        .from('songs')
        .select(`
          id,
          title,
          artist,
          cover_art,
          duration,
          bpm,
          key,
          difficulty,
          genre,
          is_premium,
          full_mix_url,
          stems (
            id,
            song_id,
            name,
            type,
            audio_path,
            color,
            position
          )
        `)
        .order('title');
        .order('display_order');

      if (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }

      return (songs as unknown as DbSong[]).map(transformSong);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - songs rarely change
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
  });
}

export function useSong(id: string) {
  return useQuery({
    queryKey: ['song', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select(`
          id,
          title,
          artist,
          cover_art,
          duration,
          bpm,
          key,
          difficulty,
          genre,
          is_premium,
          full_mix_url,
          stems (
            id,
            song_id,
            name,
            type,
            audio_path,
            color,
            position
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching song:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      return transformSong(data as unknown as DbSong);
    },
    enabled: !!id,
  });
}

// Quick access helpers that work with the cached data
export function useFreeSongs() {
  const { data: songs, ...rest } = useSongs();
  return {
    data: songs?.filter((s) => !s.isPremium),
    ...rest,
  };
}

export function usePremiumSongs() {
  const { data: songs, ...rest } = useSongs();
  return {
    data: songs?.filter((s) => s.isPremium),
    ...rest,
  };
}
