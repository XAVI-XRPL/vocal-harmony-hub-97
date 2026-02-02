import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import splashImage from "@/assets/RVMT.png";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Trigger exit after 2.5s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Complete after exit animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3100);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {!isExiting && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 bg-black"
          style={{ height: "100dvh" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
        >
          {/* Full-screen image */}
          <motion.img
            src={splashImage}
            alt="RMVT - Raab Vocal Mix Tape"
            className="absolute inset-0 w-full h-full object-cover object-top"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Dark overlay gradients for depth */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* Subtle vignette effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)"
            }}
          />

          {/* Minimal loading bar */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="w-32 h-0.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/60 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </motion.div>

          {/* Safe area padding for mobile notches */}
          <div className="absolute inset-x-0 top-0 h-[env(safe-area-inset-top)] bg-black/50" />
          <div className="absolute inset-x-0 bottom-0 h-[env(safe-area-inset-bottom)] bg-black/50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
