import { motion, useAnimationControls } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Play, ChevronRight, Sparkles, Music2, TrendingUp, ChevronLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { SongCard } from "@/components/song/SongCard";
import { mockSongs, getFeaturedSongs } from "@/data/mockSongs";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";

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
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance carousel
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredSongs.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [featuredSongs.length]);

  // Scroll to current index
  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = 280 + 16; // card width + gap
      carouselRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredSongs.length) % featuredSongs.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredSongs.length);
  };

  return (
    <div className="min-h-screen">
      <Header showSearch={false} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pb-8"
      >
        {/* Featured Songs Carousel - Moved to top */}
        <motion.section variants={itemVariants} className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <h2 className="text-lg font-semibold">Featured</h2>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-glass border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-glass border border-glass-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory"
            >
              {featuredSongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  className="snap-start flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: currentIndex === index ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <SongCard song={song} variant="featured" />
                </motion.div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {featuredSongs.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    currentIndex === index
                      ? "w-6 gradient-bg"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Quick Stats (for authenticated users) */}
        {isAuthenticated && (
          <motion.section variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-2 gap-3">
              <GlassCard padding="md" hover={false}>
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-stem-vocal/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <TrendingUp className="w-5 h-5 text-stem-vocal" />
                  </motion.div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Songs Practiced</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard padding="md" hover={false}>
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-stem-harmony/20 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <Music2 className="w-5 h-5 text-stem-harmony" />
                  </motion.div>
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
            <motion.button
              onClick={() => navigate("/library")}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors group"
              whileHover={{ x: 2 }}
            >
              Browse library
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </div>

          <div className="space-y-3">
            {mockSongs.slice(0, 4).map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SongCard song={song} variant="compact" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA for non-subscribers */}
        {!isAuthenticated && (
          <motion.section variants={itemVariants} className="mt-8">
            <GlassCard
              padding="lg"
              className="text-center border-primary/30 animate-border-glow"
              glow
              glowColor="primary"
              hover={false}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              </motion.div>
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

        {/* Hero Section - Moved to bottom */}
        <motion.section variants={itemVariants} className="py-8 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-20 h-20 mx-auto mb-6"
          >
            <motion.div
              className="w-full h-full rounded-3xl gradient-bg flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  "0 20px 50px -12px hsl(var(--primary) / 0.4)",
                  "0 25px 60px -12px hsl(var(--accent) / 0.5)",
                  "0 20px 50px -12px hsl(var(--primary) / 0.4)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Music2 className="w-10 h-10 text-white" />
            </motion.div>
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
      </motion.div>
    </div>
  );
}
