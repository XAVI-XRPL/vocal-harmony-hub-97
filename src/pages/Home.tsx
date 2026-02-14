import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { ContinuePractice } from "@/components/home/ContinuePractice";
import { HomeHubCards } from "@/components/home/HomeHubCards";
import { useUserStore } from "@/stores/userStore";
import stadiumBg from "@/assets/stadium-background.png";

function HomeBgImage({ src }: { src: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <img
      src={src}
      alt=""
      onLoad={() => setIsLoaded(true)}
      className={`w-full h-full object-cover animate-slow-zoom transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

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
  const queryClient = useQueryClient();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["songs"] }),
      queryClient.invalidateQueries({ queryKey: ["products"] }),
      queryClient.invalidateQueries({ queryKey: ["gear-products"] }),
      queryClient.invalidateQueries({ queryKey: ["partner-brands"] }),
    ]);
    toast.success("Content refreshed!");
  }, [queryClient]);

  return (
    <div className="min-h-screen relative">
      {/* Stadium Background Image */}
      <div className="absolute inset-0 z-0">
        <HomeBgImage src={stadiumBg} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <Header showSearch={false} />

      <PullToRefresh onRefresh={handleRefresh} className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 md:px-8 lg:px-12 xl:px-16 pb-8 max-w-[1400px] mx-auto"
        >
          {/* Hero Section with prominent CTA */}
          <motion.section 
            variants={itemVariants} 
            className="pt-6 pb-8 md:pt-12 md:pb-12 text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 tracking-tight">
              Master Your <span className="gradient-text">Voice</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-xs md:max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
              Train with isolated stems. Control every element of the mix.
            </p>
            
            {/* Enhanced 3D Start Training Button */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="perspective-1000"
            >
              <motion.button
                onClick={() => navigate("/library")}
                className="
                  w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto
                  flex items-center justify-center gap-3
                  text-lg md:text-xl font-semibold py-6 md:py-7 px-8 md:px-10
                  rounded-2xl
                  bg-gradient-to-b from-primary via-primary to-primary/80
                  text-primary-foreground
                  border-t border-white/30
                  shadow-[0_4px_0_0_hsl(var(--primary)/0.6),0_8px_16px_-4px_hsl(var(--primary)/0.5),0_16px_32px_-8px_hsl(var(--primary)/0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)]
                  transition-all duration-150
                  hover:shadow-[0_2px_0_0_hsl(var(--primary)/0.6),0_4px_12px_-2px_hsl(var(--primary)/0.5),0_12px_24px_-6px_hsl(var(--primary)/0.3),inset_0_1px_0_0_rgba(255,255,255,0.25)]
                  hover:translate-y-0.5
                  active:shadow-[0_1px_0_0_hsl(var(--primary)/0.6),0_2px_8px_-2px_hsl(var(--primary)/0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]
                  active:translate-y-1
                  relative overflow-hidden
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-primary/30"
                  animate={{
                    boxShadow: [
                      "0 0 20px 0 hsl(var(--primary)/0.4)",
                      "0 0 40px 8px hsl(var(--primary)/0.6)",
                      "0 0 20px 0 hsl(var(--primary)/0.4)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Light sweep effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 1,
                  }}
                />
                
                <Play className="w-6 h-6 md:w-7 md:h-7 fill-current relative z-10" />
                <span className="relative z-10">Start Training</span>
              </motion.button>
            </motion.div>
          </motion.section>

          {/* Desktop: Two-column layout | Mobile: Single column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* Hub Module Cards */}
            <motion.section variants={itemVariants}>
              <HomeHubCards />
            </motion.section>

            {/* Continue Practice */}
            <motion.section variants={itemVariants}>
              <ContinuePractice />
            </motion.section>
          </div>

          {/* CTA for non-authenticated users */}
          {!isAuthenticated && (
            <motion.section variants={itemVariants} className="max-w-2xl mx-auto">
              <GlassCard
                padding="lg"
                className="text-center border-primary/30"
                glow
                glowColor="primary"
                hover={false}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                </motion.div>
                <h3 className="text-base md:text-lg font-semibold mb-1">Unlock All Exercises</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Get access to more premium tracks and exercises.
                </p>
                <GlassButton onClick={() => navigate("/subscription")} size="sm">
                  View Plans
                </GlassButton>
              </GlassCard>
            </motion.section>
          )}
        </motion.div>
      </PullToRefresh>
    </div>
  );
}
