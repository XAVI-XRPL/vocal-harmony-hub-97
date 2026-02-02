import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { MobileNav } from "./MobileNav";
import { StadiumBackground } from "./StadiumBackground";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { useAudioStore } from "@/stores/audioStore";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const currentSong = useAudioStore((state) => state.currentSong);

  // Don't show nav on training mode or auth pages
  const hideNav = location.pathname.startsWith("/training/") || 
                  location.pathname === "/auth";

  // Show mini player when a song is selected (except on training page)
  const showMiniPlayer = currentSong && !location.pathname.startsWith("/training/");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Stadium animated background */}
      <StadiumBackground />

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
