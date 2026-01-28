import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { MobileNav } from "./MobileNav";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { useAudioStore } from "@/stores/audioStore";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const currentSong = useAudioStore((state) => state.currentSong);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Don't show nav on training mode or auth pages
  const hideNav = location.pathname.startsWith("/training/") || 
                  location.pathname === "/auth";

  // Show mini player when a song is selected (except on training page)
  const showMiniPlayer = currentSong && !location.pathname.startsWith("/training/");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background blobs for liquid effect - Theme aware */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary blob - top right */}
        <motion.div
          className={cn(
            "liquid-blob w-[600px] h-[600px] -top-48 -right-48",
            isDark ? "bg-primary/20" : "bg-primary/10"
          )}
          style={{ animationDelay: "0s" }}
          animate={isDark ? {} : {
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Accent blob - middle left */}
        <motion.div
          className={cn(
            "liquid-blob w-[500px] h-[500px] top-1/2 -left-48",
            isDark ? "bg-accent/15" : "bg-accent/8"
          )}
          style={{ animationDelay: "-4s" }}
          animate={isDark ? {} : {
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        {/* Secondary blob - bottom center-right */}
        <motion.div
          className={cn(
            "liquid-blob w-[400px] h-[400px] bottom-0 right-1/4",
            isDark ? "bg-primary/10" : "bg-gradient-end/8"
          )}
          style={{ animationDelay: "-2s" }}
          animate={isDark ? {} : {
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Extra light mode blob for richer feel */}
        {!isDark && (
          <motion.div
            className="liquid-blob w-[350px] h-[350px] top-1/4 right-1/3 bg-gradient-mid/6"
            style={{ animationDelay: "-6s" }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Main content */}
      <main
        className={cn(
          "relative z-10 min-h-screen",
          !hideNav && "pb-20", // Space for bottom nav
          showMiniPlayer && !hideNav && "pb-36" // Extra space for mini player
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mini Player */}
      <AnimatePresence>
        {showMiniPlayer && (
          <MiniPlayer />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {!hideNav && <MobileNav />}
    </div>
  );
}
