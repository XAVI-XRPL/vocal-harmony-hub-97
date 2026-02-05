/**
 * StemLoadingProgress Component
 * 
 * Displays audio mode indicator and collapsible stem loading progress.
 * Shows when playing mixdown vs stems, with per-stem progress bars.
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Music, Loader2, Zap } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AudioMode, StemLoadProgress } from "@/services/webAudioEngine";

interface StemLoadingProgressProps {
  stemLoadProgress: StemLoadProgress[];
  audioMode: AudioMode;
  allStemsReady: boolean;
  isPlaying: boolean;
  mixdownReady: boolean;
}

export function StemLoadingProgress({
  stemLoadProgress,
  audioMode,
  allStemsReady,
  isPlaying,
  mixdownReady,
}: StemLoadingProgressProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  
  // Calculate overall progress
  const loadedCount = stemLoadProgress.filter(s => s.loaded).length;
  const totalCount = stemLoadProgress.length;
  const overallProgress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;
  
  // Auto-collapse when all stems ready
  React.useEffect(() => {
    if (allStemsReady && isOpen) {
      // Delay collapse for smooth UX
      const timer = setTimeout(() => setIsOpen(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [allStemsReady, isOpen]);
  
  // Don't show if no stems to load
  if (totalCount === 0) return null;
  
  // Get mode badge config
  const getModeConfig = () => {
    switch (audioMode) {
      case 'mixdown':
        return {
          label: 'FULL MIX',
          icon: Music,
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          pulse: isPlaying,
        };
      case 'crossfading':
        return {
          label: 'SWITCHING...',
          icon: Zap,
          className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          pulse: true,
        };
      case 'stems':
        return {
          label: 'STEMS ACTIVE',
          icon: Check,
          className: 'bg-green-500/20 text-green-400 border-green-500/30',
          pulse: false,
        };
    }
  };
  
  const modeConfig = getModeConfig();
  const ModeIcon = modeConfig.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 mb-2"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="glass-card rounded-xl overflow-hidden">
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/10 transition-colors">
              {/* Left: Mode badge */}
              <div className="flex items-center gap-3">
                <motion.div
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold",
                    modeConfig.className
                  )}
                  animate={modeConfig.pulse ? { 
                    boxShadow: ['0 0 0 0 currentColor', '0 0 0 4px transparent', '0 0 0 0 currentColor']
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ModeIcon className="w-3 h-3" />
                  {modeConfig.label}
                </motion.div>
                
                {/* Loading status when not all ready */}
                {!allStemsReady && (
                  <span className="text-xs text-muted-foreground">
                    {audioMode === 'mixdown' && 'Loading stems in background...'}
                    {audioMode === 'crossfading' && 'Preparing stem mixer...'}
                  </span>
                )}
              </div>
              
              {/* Right: Progress count + chevron */}
              <div className="flex items-center gap-2">
                {/* Progress indicator */}
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
                  allStemsReady 
                    ? "bg-green-500/10 text-green-400" 
                    : "bg-muted/20 text-muted-foreground"
                )}>
                  {allStemsReady ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                  <span>{loadedCount}/{totalCount}</span>
                </div>
                
                {/* Chevron */}
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 pb-4 space-y-2"
              >
                {/* Divider */}
                <div className="h-px bg-border/50 mb-3" />
                
                {/* Per-stem progress */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto hide-scrollbar">
                  {stemLoadProgress.map((stem) => (
                    <StemProgressRow key={stem.stemId} stem={stem} />
                  ))}
                </div>
                
                {/* Footer hint */}
                {!allStemsReady && (
                  <p className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/30">
                    Stem controls will activate once all tracks load
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </motion.div>
  );
}

// Individual stem progress row
function StemProgressRow({ stem }: { stem: StemLoadProgress }) {
  return (
    <div className="flex items-center gap-3">
      {/* Status icon */}
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
        stem.loaded ? "bg-green-500/20" : "bg-muted/30"
      )}>
        {stem.loaded ? (
          <Check className="w-3 h-3 text-green-400" />
        ) : stem.error ? (
          <span className="w-2 h-2 rounded-full bg-destructive" />
        ) : (
          <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
        )}
      </div>
      
      {/* Stem name */}
      <span className={cn(
        "text-xs min-w-[100px]",
        stem.loaded ? "text-foreground" : "text-muted-foreground"
      )}>
        {stem.stemName}
      </span>
      
      {/* Progress bar */}
      <div className="flex-1">
        <Progress 
          value={stem.loaded ? 100 : stem.progress} 
          className={cn(
            "h-1.5",
            stem.loaded && "bg-green-500/20 [&>div]:bg-green-500"
          )}
        />
      </div>
      
      {/* Percentage */}
      <span className={cn(
        "text-[10px] w-10 text-right",
        stem.loaded ? "text-green-400" : "text-muted-foreground"
      )}>
        {stem.loaded ? '100%' : `${Math.round(stem.progress)}%`}
      </span>
    </div>
  );
}
