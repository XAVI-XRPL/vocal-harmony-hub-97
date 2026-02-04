import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { ContinuePractice } from "@/components/home/ContinuePractice";
import { useUserStore } from "@/stores/userStore";
import stadiumBg from "@/assets/stadium-background.png";

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

  return (
    <div className="min-h-screen relative">
      {/* Stadium Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={stadiumBg} 
          alt="" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <Header showSearch={false} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-4 pb-8"
      >
        {/* Hero Section with prominent CTA */}
        <motion.section variants={itemVariants} className="py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Master Your <span className="gradient-text">Voice</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
            Train with isolated stems. Control every element of the mix.
          </p>
          
          {/* Main Start Training Button - Hero CTA */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <GlassButton
              variant="frosted"
              size="lg"
              icon={<Play className="w-6 h-6 fill-white" />}
              onClick={() => navigate("/training-select")}
              className="w-full max-w-sm mx-auto text-lg py-7 shadow-2xl shadow-primary/30"
            >
              Start Training
            </GlassButton>
          </motion.div>
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
              <h3 className="text-base font-semibold mb-1">Unlock All Exercises</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get access to more premium tracks and exercises.
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
