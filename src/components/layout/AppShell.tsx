import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { MobileNav } from "./MobileNav";
import { DesktopSidebar } from "./DesktopSidebar";
import { StadiumBackground } from "./StadiumBackground";
import { DemoModeBanner } from "./DemoModeBanner";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { useAudioStore } from "@/stores/audioStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDemoMode } from "@/hooks/useDemoMode";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const currentSong = useAudioStore((state) => state.currentSong);
  const isMobile = useIsMobile();
  const { isDemoMode } = useDemoMode();

  // Don't show nav on training mode or auth pages
  const hideNav = location.pathname.startsWith("/training/") || 
                  location.pathname === "/auth";

  // Show mini player when a song is selected (except on training page)
  const showMiniPlayer = currentSong && !location.pathname.startsWith("/training/");

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <StadiumBackground />
        
        {/* Demo Mode Banner */}
        {isDemoMode && !hideNav && <DemoModeBanner />}
        
        <main
          className={cn(
            "relative z-10 min-h-screen",
            !hideNav && "pb-20",
            showMiniPlayer && !hideNav && "pb-36"
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

        <AnimatePresence>
          {showMiniPlayer && <MiniPlayer />}
        </AnimatePresence>

        {!hideNav && <MobileNav />}
      </div>
    );
  }

  // Desktop layout with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background relative overflow-hidden flex w-full">
        <StadiumBackground />

        {/* Desktop Sidebar */}
        {!hideNav && <DesktopSidebar />}

        {/* Main Content */}
        <SidebarInset className="flex-1 relative z-10">
          {/* Demo Mode Banner */}
          {isDemoMode && !hideNav && <DemoModeBanner />}
          
          <main
            className={cn(
              "min-h-screen",
              showMiniPlayer && "pb-24"
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

          {/* Mini Player for Desktop */}
          <AnimatePresence>
            {showMiniPlayer && <MiniPlayer />}
          </AnimatePresence>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
