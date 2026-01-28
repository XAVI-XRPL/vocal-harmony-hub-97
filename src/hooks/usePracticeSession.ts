import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAudioStore } from '@/stores/audioStore';

interface PracticeSessionData {
  songId: string;
  tempoUsed: number;
  loopsPracticed: number;
}

export function usePracticeSession(songId: string | undefined) {
  const { user, isAuthenticated } = useAuth();
  const { playbackRate, isLooping } = useAudioStore();
  
  const sessionStartRef = useRef<Date | null>(null);
  const loopCountRef = useRef(0);
  const prevLoopingRef = useRef(false);
  const activeTimeRef = useRef(0);
  const lastCheckRef = useRef<Date | null>(null);
  const isPlayingRef = useRef(false);

  // Track loop count
  useEffect(() => {
    if (isLooping && !prevLoopingRef.current) {
      loopCountRef.current += 1;
    }
    prevLoopingRef.current = isLooping;
  }, [isLooping]);

  // Track active time
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlayingRef.current && lastCheckRef.current) {
        const now = new Date();
        const elapsed = (now.getTime() - lastCheckRef.current.getTime()) / 1000;
        activeTimeRef.current += elapsed;
        lastCheckRef.current = now;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Listen to play/pause state
  useEffect(() => {
    const unsubscribe = useAudioStore.subscribe((state) => {
      if (state.isPlaying && !isPlayingRef.current) {
        // Started playing
        isPlayingRef.current = true;
        lastCheckRef.current = new Date();
      } else if (!state.isPlaying && isPlayingRef.current) {
        // Stopped playing
        isPlayingRef.current = false;
        if (lastCheckRef.current) {
          const now = new Date();
          const elapsed = (now.getTime() - lastCheckRef.current.getTime()) / 1000;
          activeTimeRef.current += elapsed;
        }
        lastCheckRef.current = null;
      }
    });

    return () => unsubscribe();
  }, []);

  // Start session
  useEffect(() => {
    if (!songId || !isAuthenticated) return;

    sessionStartRef.current = new Date();
    loopCountRef.current = 0;
    activeTimeRef.current = 0;
    lastCheckRef.current = null;
    isPlayingRef.current = false;

    return () => {
      // Session will be saved on unmount by saveSession
    };
  }, [songId, isAuthenticated]);

  const saveSession = useCallback(async () => {
    if (!user?.id || !songId || !sessionStartRef.current) return;

    const endTime = new Date();
    const durationSeconds = Math.round(activeTimeRef.current);

    // Only save if they practiced for at least 5 seconds
    if (durationSeconds < 5) return;

    try {
      // Insert practice session
      const { error: sessionError } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: user.id,
          song_id: songId,
          started_at: sessionStartRef.current.toISOString(),
          ended_at: endTime.toISOString(),
          duration_seconds: durationSeconds,
          tempo_used: playbackRate,
          loops_practiced: loopCountRef.current,
        });

      if (sessionError) {
        console.error('Error saving practice session:', sessionError);
        return;
      }

      // Update or insert user song progress
      const { data: existing } = await supabase
        .from('user_song_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .maybeSingle();

      if (existing) {
        // Update existing progress
        await supabase
          .from('user_song_progress')
          .update({
            total_practice_time: existing.total_practice_time + durationSeconds,
            times_practiced: existing.times_practiced + 1,
            last_practiced_at: endTime.toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Create new progress record
        await supabase
          .from('user_song_progress')
          .insert({
            user_id: user.id,
            song_id: songId,
            total_practice_time: durationSeconds,
            times_practiced: 1,
            last_practiced_at: endTime.toISOString(),
          });
      }
    } catch (error) {
      console.error('Error saving practice session:', error);
    }
  }, [user?.id, songId, playbackRate]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (user?.id && songId && sessionStartRef.current) {
        saveSession();
      }
    };
  }, [user?.id, songId, saveSession]);

  return {
    saveSession,
    loopCount: loopCountRef.current,
    activeTime: activeTimeRef.current,
  };
}

// Hook to fetch user practice stats
export function usePracticeStats() {
  const { user, isAuthenticated } = useAuth();

  const fetchStats = useCallback(async () => {
    if (!user?.id) return null;

    const { data: progress, error } = await supabase
      .from('user_song_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching practice stats:', error);
      return null;
    }

    const totalSongs = progress?.length || 0;
    const totalTime = progress?.reduce((acc, p) => acc + (p.total_practice_time || 0), 0) || 0;

    return {
      totalSongs,
      totalTime,
      progress: progress || [],
    };
  }, [user?.id]);

  return {
    fetchStats,
    isAuthenticated,
  };
}
