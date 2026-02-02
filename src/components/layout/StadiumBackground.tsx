import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function StadiumBackground() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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

      {/* Stadium light orbs */}
      <motion.div
        className={cn(
          "absolute w-[500px] h-[500px] -top-32 left-1/4 rounded-full blur-[120px]",
          isDark ? "bg-[hsl(200,80%,60%)]" : "bg-[hsl(200,70%,70%)]"
        )}
        animate={{
          opacity: isDark ? [0.15, 0.25, 0.15] : [0.2, 0.35, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className={cn(
          "absolute w-[400px] h-[400px] top-1/3 -right-20 rounded-full blur-[100px]",
          isDark ? "bg-[hsl(210,75%,55%)]" : "bg-[hsl(210,65%,75%)]"
        )}
        animate={{
          opacity: isDark ? [0.12, 0.22, 0.12] : [0.15, 0.28, 0.15],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <motion.div
        className={cn(
          "absolute w-[350px] h-[350px] bottom-1/4 -left-16 rounded-full blur-[90px]",
          isDark ? "bg-[hsl(195,85%,50%)]" : "bg-[hsl(195,75%,70%)]"
        )}
        animate={{
          opacity: isDark ? [0.1, 0.18, 0.1] : [0.12, 0.22, 0.12],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Light beam sweep effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: isDark
            ? "linear-gradient(135deg, transparent 40%, hsl(200 80% 70% / 0.08) 50%, transparent 60%)"
            : "linear-gradient(135deg, transparent 40%, hsl(200 70% 60% / 0.12) 50%, transparent 60%)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Secondary beam */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: isDark
            ? "linear-gradient(-45deg, transparent 35%, hsl(210 75% 65% / 0.06) 50%, transparent 65%)"
            : "linear-gradient(-45deg, transparent 35%, hsl(210 65% 55% / 0.08) 50%, transparent 65%)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["100% 0%", "0% 100%", "100% 0%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
      />

      {/* Fog/mist layer at bottom */}
      <motion.div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1/3",
          isDark
            ? "bg-gradient-to-t from-[hsl(210,50%,20%/0.15)] via-[hsl(210,60%,30%/0.08)] to-transparent"
            : "bg-gradient-to-t from-[hsl(210,40%,80%/0.2)] via-[hsl(210,50%,85%/0.1)] to-transparent"
        )}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Upper atmospheric haze */}
      <motion.div
        className={cn(
          "absolute top-0 left-0 right-0 h-1/4",
          isDark
            ? "bg-gradient-to-b from-[hsl(215,70%,15%/0.2)] to-transparent"
            : "bg-gradient-to-b from-[hsl(205,50%,90%/0.3)] to-transparent"
        )}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Subtle stadium spotlight dots */}
      {isDark && (
        <>
          <motion.div
            className="absolute w-2 h-2 top-[15%] left-[20%] rounded-full bg-white"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 top-[10%] left-[40%] rounded-full bg-white"
            animate={{
              opacity: [0.2, 0.6, 0.2],
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
            className="absolute w-2 h-2 top-[12%] right-[25%] rounded-full bg-white"
            animate={{
              opacity: [0.25, 0.7, 0.25],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute w-1 h-1 top-[8%] right-[45%] rounded-full bg-white"
            animate={{
              opacity: [0.15, 0.5, 0.15],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </>
      )}
    </div>
  );
}
