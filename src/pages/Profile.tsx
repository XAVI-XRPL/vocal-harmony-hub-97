import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Crown, ChevronRight, Music2, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils";

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

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header title="Profile" showSearch={false} />
        
        <div className="px-4 py-12 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-glass border border-glass-border flex items-center justify-center mb-6"
          >
            <User className="w-12 h-12 text-muted-foreground" />
          </motion.div>

          <h2 className="text-xl font-semibold mb-2">Sign in to continue</h2>
          <p className="text-muted-foreground text-sm text-center mb-6 max-w-xs">
            Create an account to save your progress, favorites, and access premium features.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <GlassButton fullWidth onClick={() => navigate("/auth")}>
              Sign In
            </GlassButton>
            <GlassButton variant="secondary" fullWidth onClick={() => navigate("/auth?signup=true")}>
              Create Account
            </GlassButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Profile" showSearch={false} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pb-8"
      >
        {/* Profile Header */}
        <motion.div
          variants={itemVariants}
          className="py-6 flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mb-4">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName || "Profile"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            
            {/* Subscription badge */}
            {user?.subscriptionTier !== "free" && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center border-2 border-background">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold">
            {user?.displayName || user?.email?.split("@")[0] || "User"}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>

          {/* Subscription status */}
          <div
            className={cn(
              "mt-3 px-4 py-1.5 rounded-full text-xs font-medium",
              user?.subscriptionTier === "pro"
                ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                : "bg-muted text-muted-foreground"
            )}
          >
            {user?.subscriptionTier === "pro" ? "Pro Member" : "Free Plan"}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
          <GlassCard padding="md" hover={false}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stem-vocal/20 flex items-center justify-center">
                <Music2 className="w-5 h-5 text-stem-vocal" />
              </div>
              <div>
                <p className="text-xl font-bold">12</p>
                <p className="text-2xs text-muted-foreground">Songs Practiced</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard padding="md" hover={false}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stem-harmony/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-stem-harmony" />
              </div>
              <div>
                <p className="text-xl font-bold">3.5h</p>
                <p className="text-2xs text-muted-foreground">Total Time</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Menu items */}
        <motion.div variants={itemVariants} className="space-y-2">
          {user?.subscriptionTier === "free" && (
            <GlassCard
              onClick={() => navigate("/subscription")}
              padding="md"
              className="flex items-center justify-between"
              glow
              glowColor="accent"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground">Unlock all songs & features</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </GlassCard>
          )}

          <GlassCard
            padding="md"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-glass flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-medium">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </GlassCard>

          <GlassCard
            onClick={handleLogout}
            padding="md"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span className="font-medium text-destructive">Sign Out</span>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
