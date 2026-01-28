import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoopRegionProps {
  loopStart: number;
  loopEnd: number;
  duration: number;
  isLooping: boolean;
  height: number;
  className?: string;
}

export function LoopRegion({
  loopStart,
  loopEnd,
  duration,
  isLooping,
  height,
  className,
}: LoopRegionProps) {
  if (duration === 0 || loopEnd <= loopStart) return null;

  const startPercent = (loopStart / duration) * 100;
  const endPercent = (loopEnd / duration) * 100;
  const widthPercent = endPercent - startPercent;

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ height }}
    >
      {/* Loop region highlight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLooping ? 1 : 0.5 }}
        className="absolute top-0 bottom-0"
        style={{
          left: `${startPercent}%`,
          width: `${widthPercent}%`,
        }}
      >
        {/* Main highlight area */}
        <div
          className={cn(
            "absolute inset-0 rounded-sm",
            isLooping
              ? "bg-primary/20 border-y border-primary/40"
              : "bg-muted/30 border-y border-muted/50"
          )}
        />

        {/* Animated pulse when looping */}
        {isLooping && (
          <motion.div
            className="absolute inset-0 bg-primary/10 rounded-sm"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Start marker (A) */}
        <motion.div
          className={cn(
            "absolute top-0 bottom-0 w-0.5 -ml-0.5",
            isLooping ? "bg-green-500" : "bg-green-500/50"
          )}
          style={{ left: 0 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* A marker label */}
          <div
            className={cn(
              "absolute -top-0.5 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded text-[8px] font-bold",
              isLooping
                ? "bg-green-500 text-white"
                : "bg-green-500/50 text-white/80"
            )}
          >
            A
          </div>
          
          {/* Glow effect */}
          {isLooping && (
            <motion.div
              className="absolute inset-0 bg-green-500"
              animate={{
                boxShadow: [
                  "0 0 4px hsl(142 76% 36% / 0.4)",
                  "0 0 12px hsl(142 76% 36% / 0.6)",
                  "0 0 4px hsl(142 76% 36% / 0.4)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* End marker (B) */}
        <motion.div
          className={cn(
            "absolute top-0 bottom-0 w-0.5",
            isLooping ? "bg-red-500" : "bg-red-500/50"
          )}
          style={{ right: 0 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          {/* B marker label */}
          <div
            className={cn(
              "absolute -top-0.5 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded text-[8px] font-bold",
              isLooping
                ? "bg-red-500 text-white"
                : "bg-red-500/50 text-white/80"
            )}
          >
            B
          </div>
          
          {/* Glow effect */}
          {isLooping && (
            <motion.div
              className="absolute inset-0 bg-red-500"
              animate={{
                boxShadow: [
                  "0 0 4px hsl(0 84% 60% / 0.4)",
                  "0 0 12px hsl(0 84% 60% / 0.6)",
                  "0 0 4px hsl(0 84% 60% / 0.4)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
