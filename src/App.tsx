import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Loader2 } from "lucide-react";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";

// Eagerly loaded (needed immediately)
import Home from "./pages/Home";
import Library from "./pages/Library";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy loaded (loaded on navigation)
const Hub = lazy(() => import("./pages/Hub"));
const VocalRiderStore = lazy(() => import("./pages/VocalRiderStore"));
const VocalHealth = lazy(() => import("./pages/VocalHealth"));
const StagePrep = lazy(() => import("./pages/StagePrep"));
const Playlists = lazy(() => import("./pages/Playlists"));
const PlaylistDetail = lazy(() => import("./pages/PlaylistDetail"));
const SongDetail = lazy(() => import("./pages/SongDetail"));
const TrainingMode = lazy(() => import("./pages/TrainingMode"));
const Profile = lazy(() => import("./pages/Profile"));
const Progress = lazy(() => import("./pages/Progress"));
const Subscription = lazy(() => import("./pages/Subscription"));

const queryClient = new QueryClient();

function LazyFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

// Component that handles navigation after splash/onboarding completes
function AppRoutes({ onAppReady }: { onAppReady: () => void }) {
  const navigate = useNavigate();
  const [hasNavigatedHome, setHasNavigatedHome] = useState(false);

  useEffect(() => {
    if (!hasNavigatedHome) {
      navigate("/", { replace: true });
      setHasNavigatedHome(true);
      onAppReady();
    }
  }, [navigate, hasNavigatedHome, onAppReady]);

  return (
    <Suspense fallback={<LazyFallback />}>
      <Routes>
        {/* Auth page without AppShell */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Main app routes with AppShell */}
        <Route path="*" element={
          <AppShell>
            <Suspense fallback={<LazyFallback />}>
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
                <Route path="/vocal-health" element={<VocalHealth />} />
                <Route path="/stage-prep" element={<StagePrep />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AppShell>
        } />
      </Routes>
    </Suspense>
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

  const handleAppReady = () => {};

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
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <AppContent />
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
