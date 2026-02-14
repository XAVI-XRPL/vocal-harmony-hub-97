import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Music4, Layers } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { RMVTLogo } from "@/components/ui/RMVTLogo";
import { StadiumBackground } from "@/components/layout/StadiumBackground";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  onComplete: (mode: "auth" | "demo") => void;
}

const slides = [
  {
    id: "welcome",
    title: "Master Your Voice",
    description: "Professional stem-based vocal training",
  },
  {
    id: "how-it-works",
    title: "Control Every Layer",
    description: "Isolate vocals, harmonies, and instruments to practice your part",
  },
  {
    id: "get-started",
    title: "Ready to Train?",
    description: "Create an account or explore with a demo",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setCurrentSlide(slides.length - 1);
  };

  const handleCreateAccount = () => {
    onComplete("auth");
    navigate("/auth?signup=true");
  };

  const handleSignIn = () => {
    onComplete("auth");
    navigate("/auth");
  };

  const handleTryDemo = () => {
    onComplete("demo");
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
    >
      {/* Stadium Background */}
      <StadiumBackground />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 md:from-black/60 md:via-black/40 md:to-black/80" />

      {/* Desktop: Two-column layout | Mobile: Single column */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center flex-1 gap-12 md:gap-20 lg:gap-32 px-8 md:px-16 lg:px-24">
        
        {/* Left Column (Desktop) / Top (Mobile): Visual Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 flex flex-col items-center justify-center max-w-xl md:mt-0 mt-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* Slide 1: Welcome with Logo */}
              {currentSlide === 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center"
                >
                  <RMVTLogo size="xl" animated />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center"
                  >
                    <p className="text-white/80 text-lg md:text-xl max-w-md">
                      The professional platform for stem-based vocal training
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {/* Slide 2: Stem visualization */}
              {currentSlide === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-md mx-auto"
                >
                  <div className="space-y-4 md:space-y-6">
                    {[
                      { name: "Lead Vocals", color: "hsl(var(--stem-vocal))", width: "90%", icon: "🎤" },
                      { name: "Harmonies", color: "hsl(var(--stem-harmony))", width: "75%", icon: "🎵" },
                      { name: "Instrumentals", color: "hsl(var(--primary))", width: "65%", icon: "🎹" },
                      { name: "Backing Track", color: "hsl(var(--stem-bass))", width: "55%", icon: "🎸" },
                    ].map((stem, i) => (
                      <motion.div
                        key={stem.name}
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 150 }}
                        className="flex items-center gap-4"
                      >
                        <span className="text-2xl">{stem.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm md:text-base text-white/90 font-medium">{stem.name}</span>
                            <span className="text-xs text-white/60">{stem.width}</span>
                          </div>
                          <div className="h-3 md:h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                            <motion.div
                              className="h-full rounded-full shadow-lg"
                              style={{ 
                                backgroundColor: stem.color,
                                boxShadow: `0 0 20px ${stem.color}50`
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: stem.width }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-white/70 text-sm md:text-base text-center mt-8"
                  >
                    Control each element independently. Mute, solo, or adjust volume to focus on what matters.
                  </motion.p>
                </motion.div>
              )}

              {/* Slide 3: Get Started icon */}
              {currentSlide === 2 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-primary/20 backdrop-blur-md flex items-center justify-center border-2 border-primary/40 shadow-2xl">
                    <Music4 className="w-14 h-14 md:w-16 md:h-16 text-primary drop-shadow-[0_0_20px_hsl(var(--primary))]" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center max-w-md"
                  >
                    <p className="text-white/80 text-base md:text-lg">
                      Join thousands of vocalists improving their craft with RVMT
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Right Column (Desktop) / Bottom (Mobile): Text & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex-1 flex flex-col items-center md:items-start justify-center max-w-lg md:mb-0 mb-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full text-center md:text-left"
            >
              {/* Title and description */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white leading-tight"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 text-lg md:text-xl lg:text-2xl mb-8 md:mb-12"
              >
                {slide.description}
              </motion.p>

              {/* Progress dots */}
              <div className="flex justify-center md:justify-start gap-2 mb-8">
                {slides.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i === currentSlide
                        ? "w-10 md:w-12 bg-primary"
                        : "w-2 bg-white/30 hover:bg-white/50"
                    )}
                    animate={i === currentSlide ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>

              {/* CTA Buttons */}
              {!isLastSlide ? (
                <div className="space-y-3">
                  <GlassButton
                    size="lg"
                    variant="frosted"
                    className="w-full md:w-auto md:min-w-[240px]"
                    onClick={handleNext}
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </GlassButton>
                  <button
                    onClick={handleSkip}
                    className="w-full md:w-auto text-center py-3 px-6 text-white/60 hover:text-white text-sm transition-colors block md:inline-block md:ml-4"
                  >
                    Skip
                  </button>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <GlassButton
                    size="lg"
                    variant="frosted"
                    className="w-full md:w-auto md:min-w-[300px] text-lg"
                    onClick={handleCreateAccount}
                  >
                    Create Account
                  </GlassButton>
                  <GlassButton
                    size="lg"
                    variant="secondary"
                    className="w-full md:w-auto md:min-w-[300px] border-white/20 text-white hover:bg-white/10"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </GlassButton>
                  <button
                    onClick={handleTryDemo}
                    className="w-full md:w-auto md:min-w-[300px] text-center py-3 text-white/60 hover:text-white text-sm transition-colors block"
                  >
                    Try Demo Mode
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
