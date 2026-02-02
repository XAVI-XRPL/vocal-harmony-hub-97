import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { VocalProgressDiagram } from "@/components/home/VocalProgressDiagram";
import { ContinuePractice } from "@/components/home/ContinuePractice";
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

  // Mock progress data (would come from user store/API in real app)
  const progressData = {
    overallProgress: 67,
    level: "intermediate" as const,
    skills: {
      pitch: 75,
      breath: 60,
      range: 45,
      rhythm: 80,
    },
    streak: 7,
    sessions: 12,
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
        {/* Hero Section - Clean without icon */}
        <motion.section variants={itemVariants} className="py-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Master Your <span className="gradient-text">Voice</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Train with isolated stems. Control every element of the mix.
          </p>
        </motion.section>

        {/* Vocal Progress Diagram */}
        <motion.section variants={itemVariants} className="mb-6">
          <VocalProgressDiagram {...progressData} />
        </motion.section>

        {/* Start Training CTA */}
        <motion.section variants={itemVariants} className="mb-6">
          <GlassButton
            size="lg"
            icon={<Play className="w-5 h-5 fill-white" />}
            onClick={() => navigate("/training-select")}
            className="w-full text-base py-6"
          >
            Start Training
          </GlassButton>
        </motion.section>

        {/* Quick Stats */}
        <motion.section variants={itemVariants} className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <GlassCard padding="md" hover={false} depth="raised" shine>
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <TrendingUp className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Songs Practiced</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard padding="md" hover={false} depth="raised" shine>
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Clock className="w-5 h-5 text-accent" />
                </motion.div>
                <div>
                  <p className="text-2xl font-bold">3.5h</p>
                  <p className="text-xs text-muted-foreground">Training Time</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        {/* Continue Practice */}
        <motion.section variants={itemVariants} className="mb-6">
          <ContinuePractice />
        </motion.section>

        {/* CTA for non-authenticated users */}
        {!isAuthenticated && (
          <motion.section variants={itemVariants}>
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
                <Sparkles className="w-7 h-7 text-primary mx-auto mb-2" />
              </motion.div>
              <h3 className="text-base font-semibold mb-1">Unlock All Songs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get access to 100+ premium tracks and advanced features.
              </p>
              <GlassButton onClick={() => navigate("/subscription")} size="sm">
                View Plans
              </GlassButton>
            </GlassCard>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
