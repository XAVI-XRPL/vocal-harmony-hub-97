import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Music4 } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      {/* Animated background blobs - Theme aware */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, hsl(var(--gradient-start) / ${isDark ? 0.4 : 0.2}) 0%, transparent 70%)`,
            top: "10%",
            left: "20%",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: `radial-gradient(circle, hsl(var(--gradient-mid) / ${isDark ? 0.3 : 0.15}) 0%, transparent 70%)`,
            top: "40%",
            right: "10%",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{
            background: `radial-gradient(circle, hsl(var(--gradient-end) / ${isDark ? 0.3 : 0.15}) 0%, transparent 70%)`,
            bottom: "20%",
            left: "30%",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative"
        >
          <motion.div
            className="w-28 h-28 rounded-3xl gradient-bg flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                `0 0 40px hsl(var(--gradient-start) / ${isDark ? 0.4 : 0.25})`,
                `0 0 60px hsl(var(--gradient-mid) / ${isDark ? 0.5 : 0.3})`,
                `0 0 40px hsl(var(--gradient-start) / ${isDark ? 0.4 : 0.25})`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Music4 className="w-14 h-14 text-white" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <h1 className="text-4xl font-bold gradient-text">RVMT</h1>
          <p className="text-muted-foreground mt-2">Vocal Training</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 h-1 bg-muted/30 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full gradient-bg"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
