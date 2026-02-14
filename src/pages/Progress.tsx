import { motion } from "framer-motion";
import { Flame, Clock, Music, Trophy, TrendingUp, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/ui/glass-card";
import { StadiumBackground } from "@/components/layout/StadiumBackground";
import { useUserStore } from "@/stores/userStore";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface DayProgress {
  day: string;
  minutes: number;
}

export default function Progress() {
  const user = useUserStore((state) => state.user);

  // Fetch practice stats
  const { data: stats } = useQuery({
    queryKey: ["practiceStats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: sessions } = await supabase
        .from("practice_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      const { data: songProgress } = await supabase
        .from("user_song_progress")
        .select("*")
        .eq("user_id", user.id);

      const totalTime = sessions?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) || 0;
      const totalSessions = sessions?.length || 0;
      const songsCount = songProgress?.length || 0;

      return {
        totalTime,
        totalSessions,
        songsCount,
        sessions: sessions || [],
        songProgress: songProgress || [],
      };
    },
    enabled: !!user?.id,
  });

  // Calculate weekly data
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData: DayProgress[] = weekDays.map((day) => ({
    day,
    minutes: Math.floor(Math.random() * 45), // Placeholder - would calculate from real data
  }));

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1);

  return (
    <div className="min-h-screen">
      <StadiumBackground />
      <Header title="Progress" showSearch={false} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 md:px-8 lg:px-12 xl:px-16 pb-32 space-y-4 md:space-y-6 lg:space-y-8 max-w-[1200px] mx-auto"
      >
        {/* Streak Card */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px hsl(var(--primary) / 0.3)",
                    "0 0 40px hsl(var(--primary) / 0.5)",
                    "0 0 20px hsl(var(--primary) / 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <p className="text-2xl font-bold text-foreground">7 Days</p>
                <p className="text-sm text-muted-foreground">Practice Streak</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "w-2 h-8 rounded-full",
                    i < 5 ? "gradient-bg" : "bg-muted"
                  )}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-lg font-bold text-foreground">
              {stats ? formatTime(stats.totalTime) : "0m"}
            </p>
            <p className="text-xs text-muted-foreground">Total Time</p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <Music className="w-5 h-5 mx-auto mb-2 text-accent" />
            <p className="text-lg font-bold text-foreground">
              {stats?.songsCount || 0}
            </p>
            <p className="text-xs text-muted-foreground">Songs</p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-emerald-500 dark:text-emerald-400" />
            <p className="text-lg font-bold text-foreground">
              {stats?.totalSessions || 0}
            </p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </GlassCard>
        </div>

        {/* Weekly Chart */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              This Week
            </h3>
            <span className="text-xs text-muted-foreground">
              {weeklyData.reduce((a, b) => a + b.minutes, 0)} min total
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full rounded-t-lg gradient-bg relative overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ minHeight: day.minutes > 0 ? 8 : 0 }}
                >
                  <div
                    className="absolute inset-0 bg-white/20 opacity-30"
                  />
                </motion.div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard className="p-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Achievements
          </h3>

          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: "🎯", label: "First Session", unlocked: true },
              { icon: "🔥", label: "3 Day Streak", unlocked: true },
              { icon: "⚡", label: "Speed Demon", unlocked: false },
              { icon: "🎵", label: "5 Songs", unlocked: false },
              { icon: "🏆", label: "Champion", unlocked: false },
              { icon: "💪", label: "10 Hours", unlocked: false },
              { icon: "🌟", label: "Perfect Loop", unlocked: true },
              { icon: "🎸", label: "Pro Player", unlocked: false },
            ].map((badge, i) => (
              <motion.div
                key={i}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-center p-2",
                  badge.unlocked
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-muted/50 border border-muted opacity-50"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
