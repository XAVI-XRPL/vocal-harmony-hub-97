import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export function PullToRefresh({ children, onRefresh, className = "" }: PullToRefreshProps) {
  const {
    containerRef,
    pullDistance,
    isRefreshing,
    progress,
    shouldTrigger,
    handlers,
  } = usePullToRefresh({ onRefresh });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      {...handlers}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {(pullDistance > 10 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 flex justify-center z-50 pointer-events-none"
            style={{ top: Math.max(pullDistance - 40, 8) }}
          >
            <motion.div
              className={`flex items-center justify-center w-10 h-10 rounded-full 
                ${shouldTrigger || isRefreshing 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
                } shadow-lg transition-colors`}
              animate={isRefreshing ? { rotate: 360 } : { rotate: progress * 180 }}
              transition={isRefreshing 
                ? { duration: 1, repeat: Infinity, ease: "linear" } 
                : { duration: 0 }
              }
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with pull offset */}
      <motion.div
        animate={{ y: pullDistance > 10 ? pullDistance : 0 }}
        transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
