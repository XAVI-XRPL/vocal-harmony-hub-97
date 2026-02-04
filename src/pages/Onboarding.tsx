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
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-4 safe-top">
        {!isLastSlide && (
          <motion.button
            onClick={handleSkip}
            className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center"
          >
            {/* Slide 1: Welcome with Logo */}
            {currentSlide === 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-8"
              >
                <RMVTLogo size="xl" animated />
              </motion.div>
            )}

            {/* Slide 2: Stem visualization */}
            {currentSlide === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8 w-64"
              >
                <div className="space-y-3">
                  {[
                    { name: "Vocals", color: "hsl(var(--stem-vocal))", width: "85%" },
                    { name: "Harmony", color: "hsl(var(--stem-harmony))", width: "70%" },
                    { name: "Instrumental", color: "hsl(var(--primary))", width: "60%" },
                  ].map((stem, i) => (
                    <motion.div
                      key={stem.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs text-white/70 w-20 text-right">{stem.name}</span>
                      <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: stem.color }}
                          initial={{ width: 0 }}
                          animate={{ width: stem.width }}
                          transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Slide 3: Get Started icon */}
            {currentSlide === 2 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                  <Music4 className="w-10 h-10 text-primary" />
                </div>
              </motion.div>
            )}

            {/* Title and description */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl sm:text-4xl font-bold mb-3 text-white"
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-lg max-w-xs"
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 px-8 pb-12 safe-bottom">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/30 hover:bg-white/50"
              )}
              animate={i === currentSlide ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* CTA Buttons */}
        {!isLastSlide ? (
          <GlassButton
            size="lg"
            variant="frosted"
            className="w-full"
            onClick={handleNext}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </GlassButton>
        ) : (
          <div className="space-y-3">
            <GlassButton
              size="lg"
              variant="frosted"
              className="w-full"
              onClick={handleCreateAccount}
            >
              Create Account
            </GlassButton>
            <GlassButton
              size="lg"
              variant="secondary"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={handleSignIn}
            >
              Sign In
            </GlassButton>
            <button
              onClick={handleTryDemo}
              className="w-full text-center py-3 text-white/60 hover:text-white text-sm transition-colors"
            >
              Try Demo Mode
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
