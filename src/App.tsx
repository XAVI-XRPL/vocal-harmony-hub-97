import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useDemoMode } from "@/hooks/useDemoMode";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Hub from "./pages/Hub";
import VocalRiderStore from "./pages/VocalRiderStore";
import Library from "./pages/Library";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import SongDetail from "./pages/SongDetail";
import TrainingMode from "./pages/TrainingMode";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import Subscription from "./pages/Subscription";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component that handles navigation after splash/onboarding completes
function AppRoutes({ onAppReady }: { onAppReady: () => void }) {
  const navigate = useNavigate();
  const [hasNavigatedHome, setHasNavigatedHome] = useState(false);

  useEffect(() => {
    // Navigate to home once when app becomes ready
    if (!hasNavigatedHome) {
      navigate("/", { replace: true });
      setHasNavigatedHome(true);
      onAppReady();
    }
  }, [navigate, hasNavigatedHome, onAppReady]);

  return (
    <Routes>
      {/* Auth page without AppShell */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Main app routes with AppShell */}
      <Route path="*" element={
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/library" element={<Library />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlist/:id" element={<PlaylistDetail />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/song/:id" element={<SongDetail />} />
            <Route path="/training/:id" element={<TrainingMode />} />
            <Route path="/training" element={<Library />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscription" element={<Subscription />} />
            {/* Toolkit routes */}
            <Route path="/store" element={<VocalRiderStore />} />
            <Route path="/vocal-health" element={<Hub />} />
            <Route path="/stage-prep" element={<Hub />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      } />
    </Routes>
  );
}

function AppContent() {
  const { isComplete, isLoading: onboardingLoading, completeOnboarding } = useOnboarding();
  const { enableDemoMode, isLoading: demoLoading } = useDemoMode();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showApp, setShowApp] = useState(false);

  // After splash completes, check if we need onboarding
  const handleSplashComplete = () => {
    if (isComplete) {
      setShowSplash(false);
      setShowApp(true);
    } else {
      setShowSplash(false);
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = (mode: "auth" | "demo") => {
    if (mode === "demo") {
      enableDemoMode();
    }
    completeOnboarding();
    setShowOnboarding(false);
    setShowApp(true);
  };

  const handleAppReady = () => {
    // App has navigated to home and is ready
  };

  // Wait for onboarding and demo mode state to load
  if (onboardingLoading || demoLoading) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <Splash key="splash" onComplete={handleSplashComplete} />
        )}
        {showOnboarding && !showSplash && (
          <Onboarding key="onboarding" onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      {showApp && (
        <AppRoutes onAppReady={handleAppReady} />
      )}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
