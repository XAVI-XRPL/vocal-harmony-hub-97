import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, ChevronRight, Sparkles, Music2, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { SongCard } from "@/components/song/SongCard";
import { mockSongs, getFeaturedSongs } from "@/data/mockSongs";
import { useUserStore } from "@/stores/userStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const featuredSongs = getFeaturedSongs();

  return (
    <div className="min-h-screen">
      <Header showSearch={false} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pb-8"
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="py-8 text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-bg flex items-center justify-center shadow-2xl"
          >
            <Music2 className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Master Your <span className="gradient-text">Voice</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-6">
            Train with isolated stems. Control vocals, harmonies, and instrumentals independently.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <GlassButton
              size="lg"
              icon={<Play className="w-5 h-5 fill-white" />}
              onClick={() => navigate("/library")}
            >
              Start Training
            </GlassButton>
            {!isAuthenticated && (
              <GlassButton
                variant="secondary"
                size="lg"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </GlassButton>
            )}
          </div>
        </motion.section>

        {/* Featured Songs */}
        <motion.section variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Featured</h2>
            </div>
            <button
              onClick={() => navigate("/library")}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
            {featuredSongs.map((song) => (
              <SongCard key={song.id} song={song} variant="featured" />
            ))}
          </div>
        </motion.section>

        {/* Quick Stats (for authenticated users) */}
        {isAuthenticated && (
          <motion.section variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-2 gap-3">
              <GlassCard padding="md" hover={false}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stem-vocal/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-stem-vocal" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Songs Practiced</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard padding="md" hover={false}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stem-harmony/20 flex items-center justify-center">
                    <Music2 className="w-5 h-5 text-stem-harmony" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3.5h</p>
                    <p className="text-xs text-muted-foreground">Training Time</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.section>
        )}

        {/* Recent / All Songs */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">All Songs</h2>
            <button
              onClick={() => navigate("/library")}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Browse library
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {mockSongs.slice(0, 4).map((song) => (
              <SongCard key={song.id} song={song} variant="compact" />
            ))}
          </div>
        </motion.section>

        {/* CTA for non-subscribers */}
        {!isAuthenticated && (
          <motion.section variants={itemVariants} className="mt-8">
            <GlassCard
              padding="lg"
              className="text-center border-primary/30"
              glow
              glowColor="primary"
              hover={false}
            >
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Unlock All Songs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get access to 100+ premium tracks and advanced training features.
              </p>
              <GlassButton onClick={() => navigate("/subscription")}>
                View Plans
              </GlassButton>
            </GlassCard>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
