import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Generate particle configurations - reduced for performance
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 60 + Math.random() * 40, // Start from lower portion
    size: Math.random() * 3 + 1,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 12}s`,
  }));
};

export function StadiumBackground() {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const isDark = resolvedTheme === "dark";

  // Fewer particles on mobile for better performance
  const particleCount = isMobile ? 10 : 20;
  const particles = useMemo(() => generateParticles(particleCount), [particleCount]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base gradient - deep stadium blue */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-500",
          isDark
            ? "bg-gradient-to-b from-[hsl(215,80%,8%)] via-[hsl(210,70%,6%)] to-[hsl(220,60%,4%)]"
            : "bg-gradient-to-b from-[hsl(205,60%,95%)] via-[hsl(210,50%,92%)] to-[hsl(215,40%,88%)]"
        )}
      />

      {/* Stadium light orbs - using CSS animations instead of Framer Motion */}
      <div
        className={cn(
          "absolute w-[500px] h-[500px] -top-32 left-1/4 rounded-full blur-[120px] animate-stadium-glow-1",
          isDark ? "bg-[hsl(200,80%,60%)]" : "bg-[hsl(200,70%,70%)]"
        )}
        style={{ willChange: "opacity, transform" }}
      />

      <div
        className={cn(
          "absolute w-[400px] h-[400px] top-1/3 -right-20 rounded-full blur-[100px] animate-stadium-glow-2",
          isDark ? "bg-[hsl(210,75%,55%)]" : "bg-[hsl(210,65%,75%)]"
        )}
        style={{ willChange: "opacity, transform" }}
      />

      <div
        className={cn(
          "absolute w-[350px] h-[350px] bottom-1/4 -left-16 rounded-full blur-[90px] animate-stadium-glow-3",
          isDark ? "bg-[hsl(195,85%,50%)]" : "bg-[hsl(195,75%,70%)]"
        )}
        style={{ willChange: "opacity, transform" }}
      />

      {/* Light beam sweep effect - CSS animation */}
      <div
        className="absolute top-0 left-0 w-full h-full animate-beam-sweep"
        style={{
          background: isDark
            ? "linear-gradient(135deg, transparent 40%, hsl(200 80% 70% / 0.08) 50%, transparent 60%)"
            : "linear-gradient(135deg, transparent 40%, hsl(200 70% 60% / 0.12) 50%, transparent 60%)",
          backgroundSize: "400% 400%",
          willChange: "background-position",
        }}
      />

      {/* Floating light specks / particles - CSS animations */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={cn(
              "absolute rounded-full animate-particle-float",
              isDark ? "bg-white" : "bg-[hsl(200,80%,50%)]"
            )}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
              opacity: isDark ? 0.4 : 0.25,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* Fog/mist layer at bottom - reduced animation */}
      <motion.div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1/3",
          isDark
            ? "bg-gradient-to-t from-[hsl(210,50%,20%/0.15)] via-[hsl(210,60%,30%/0.08)] to-transparent"
            : "bg-gradient-to-t from-[hsl(210,40%,80%/0.2)] via-[hsl(210,50%,85%/0.1)] to-transparent"
        )}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle stadium spotlight dots - only on desktop dark mode */}
      {isDark && !isMobile && (
        <>
          <div
            className="absolute w-2 h-2 top-[15%] left-[20%] rounded-full bg-white animate-spotlight-pulse"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute w-1.5 h-1.5 top-[10%] left-[40%] rounded-full bg-white animate-spotlight-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute w-2 h-2 top-[12%] right-[25%] rounded-full bg-white animate-spotlight-pulse"
            style={{ animationDelay: "1s" }}
          />
        </>
      )}
    </div>
  );
}
