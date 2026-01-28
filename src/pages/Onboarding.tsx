import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music4, Layers, SlidersHorizontal, ChevronRight } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Music4,
    title: "Welcome to RVMT",
    description: "Master your voice with isolated stem training technology",
    color: "hsl(var(--gradient-start))",
  },
  {
    icon: Layers,
    title: "Separate & Control",
    description: "Isolate vocals, harmonies, and instrumentals independently",
    color: "hsl(var(--stem-harmony))",
  },
  {
    icon: SlidersHorizontal,
    title: "Solo & Mute",
    description: "Solo any track to focus, or mute to practice your part",
    color: "hsl(var(--stem-vocal))",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${slide.color}20 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-4 safe-top">
        {!isLastSlide && (
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon */}
            <motion.div
              className="w-32 h-32 rounded-3xl flex items-center justify-center mb-8"
              style={{
                background: `linear-gradient(135deg, ${slide.color}40, ${slide.color}20)`,
                boxShadow: `0 0 60px ${slide.color}40`,
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon className="w-16 h-16" style={{ color: slide.color }} />
            </motion.div>

            {/* Stem waveform demo for slide 2 */}
            {currentSlide === 1 && (
              <div className="mb-8 space-y-2 w-64">
                {["Vocal", "Harmony", "Instrumental"].map((name, i) => (
                  <motion.div
                    key={name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xs text-muted-foreground w-20">{name}</span>
                    <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `hsl(var(--stem-${name.toLowerCase()}))`,
                          width: `${60 + i * 15}%`,
                        }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Solo/Mute demo for slide 3 */}
            {currentSlide === 2 && (
              <div className="mb-8 flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border-2"
                  style={{
                    borderColor: slide.color,
                    background: `${slide.color}20`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 0 ${slide.color}00`,
                      `0 0 20px ${slide.color}40`,
                      `0 0 0 ${slide.color}00`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-sm font-bold" style={{ color: slide.color }}>S</span>
                </motion.div>
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted/30 border border-muted"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <span className="text-sm font-bold text-muted-foreground">M</span>
                </motion.div>
                <div className="w-32 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-bg"
                    animate={{ width: ["30%", "70%", "30%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
              </div>
            )}

            {/* Title and description */}
            <h2 className="text-3xl font-bold mb-3">{slide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 px-8 pb-12 safe-bottom">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentSlide ? "w-8 gradient-bg" : "w-2 bg-muted"
              )}
              animate={i === currentSlide ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* CTA Button */}
        <GlassButton
          size="lg"
          className="w-full"
          onClick={handleNext}
        >
          {isLastSlide ? "Start Training" : "Next"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </GlassButton>
      </div>
    </div>
  );
}
