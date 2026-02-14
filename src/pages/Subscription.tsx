import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Zap, Music2, Sliders, Repeat } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { StadiumBackground } from "@/components/layout/StadiumBackground";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";

const features = {
  free: [
    "Access to 5 free songs",
    "Basic stem controls",
    "Standard audio quality",
  ],
  pro: [
    "Unlimited song library",
    "All stem controls (solo, mute, volume)",
    "High-quality audio",
    "Loop & tempo controls",
    "Progress tracking",
    "New songs weekly",
    "Priority support",
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Subscription() {
  const navigate = useNavigate();
  const { user, updateSubscription } = useUserStore();

  const isPro = user?.subscriptionTier === "pro";

  const handleUpgrade = () => {
    // In a real app, this would open Stripe checkout
    // For demo, we'll just simulate the upgrade
    updateSubscription("pro", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <StadiumBackground />
      {/* Header */}
      <div className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0">
        <div className="flex items-center gap-3 h-14 px-4 safe-top">
          <IconButton
            icon={ArrowLeft}
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            label="Go back"
          />
          <h1 className="text-lg font-semibold">Subscription</h1>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pb-8"
      >
        {/* Hero */}
        <motion.div variants={itemVariants} className="py-8 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-20 h-20 mx-auto mb-6"
          >
            <motion.div
              className="w-full h-full rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  "0 20px 50px -12px rgba(245, 158, 11, 0.4)",
                  "0 25px 60px -12px rgba(249, 115, 22, 0.5)",
                  "0 20px 50px -12px rgba(245, 158, 11, 0.4)",
                ],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>

          <h1 className="text-2xl font-bold mb-2">
            {isPro ? "You're a Pro!" : "Unlock Your Full Potential"}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {isPro
              ? "Thank you for being a Pro member. Enjoy unlimited access to all features."
              : "Get unlimited access to all songs and premium training features."}
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Music2, label: "100+ Songs", color: "stem-vocal" },
            { icon: Sliders, label: "Full Controls", color: "stem-harmony" },
            { icon: Repeat, label: "Loop & Tempo", color: "stem-instrumental" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <GlassCard padding="md" hover={false} className="text-center">
                <div
                  className={cn("w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center", `bg-${item.color}/20`)}
                >
                  <item.icon className={cn("w-5 h-5", `text-${item.color}`)} />
                </div>
                <p className="text-xs font-medium">{item.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing cards */}
        <motion.div variants={itemVariants} className="space-y-4 mb-8">
          {/* Free plan */}
          <GlassCard padding="lg" hover={false} className={cn(!isPro && "border-glass-border-hover")}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Free</h3>
                <p className="text-2xl font-bold">$0</p>
              </div>
              {!isPro && (
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  Current Plan
                </span>
              )}
            </div>
            <ul className="space-y-2">
              {features.free.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Pro plan */}
          <motion.div
            animate={!isPro ? {
              boxShadow: [
                "0 0 0 0 hsl(var(--primary) / 0)",
                "0 0 30px 0 hsl(var(--primary) / 0.2)",
                "0 0 0 0 hsl(var(--primary) / 0)",
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GlassCard
              padding="lg"
              hover={false}
              className={cn(
                "border-2 relative overflow-hidden",
                isPro ? "border-amber-500/50" : "border-primary/50"
              )}
              glow
              glowColor="accent"
            >
              {/* Popular badge */}
              <motion.div 
                className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Most Popular
              </motion.div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-5 h-5 text-amber-400" />
                    </motion.div>
                    Pro
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">$9.99</p>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>
                {isPro && (
                  <motion.span 
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-xs font-medium border border-amber-500/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Active
                  </motion.span>
                )}
              </div>
              <ul className="space-y-2 mb-6">
                {features.pro.map((feature, index) => (
                  <motion.li 
                    key={feature} 
                    className="flex items-center gap-2 text-sm"
                    initial={index < 6 ? { opacity: 0, x: -10 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index, 5) * 0.05 }}
                  >
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              {!isPro && (
                <GlassButton
                  fullWidth
                  size="lg"
                  icon={<Zap className="w-5 h-5" />}
                  onClick={handleUpgrade}
                >
                  Start Free Trial
                </GlassButton>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* FAQ or additional info */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-xs text-muted-foreground">
            Cancel anytime. No questions asked.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
