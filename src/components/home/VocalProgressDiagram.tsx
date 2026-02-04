import { motion } from "framer-motion";
import { Trophy, Flame } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface SkillData {
  pitch: number;
  breath: number;
  range: number;
  rhythm: number;
}

interface VocalProgressDiagramProps {
  overallProgress: number;
  level: "beginner" | "intermediate" | "advanced";
  skills: SkillData;
  streak: number;
  sessions: number;
  className?: string;
}

const levelConfig = {
  beginner: { label: "Beginner", level: 1 },
  intermediate: { label: "Intermediate", level: 2 },
  advanced: { label: "Advanced", level: 3 },
};

// Skill color configuration
const skillColors: Record<string, { main: string; glow: string }> = {
  Pitch: { main: "hsl(190, 90%, 55%)", glow: "rgba(34, 211, 238, 0.3)" },
  Breath: { main: "hsl(160, 84%, 45%)", glow: "rgba(16, 185, 129, 0.3)" },
  Range: { main: "hsl(270, 85%, 65%)", glow: "rgba(167, 139, 250, 0.3)" },
  Rhythm: { main: "hsl(32, 95%, 55%)", glow: "rgba(245, 158, 11, 0.3)" },
};

// Custom dot component - smaller and cleaner
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = skillColors[payload.skill] || { main: "hsl(200, 90%, 55%)", glow: "rgba(100, 200, 255, 0.3)" };
  
  return (
    <g>
      {/* Subtle glow effect */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color.glow}
        style={{ filter: "blur(1.5px)" }}
      />
      {/* Main dot - smaller */}
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={color.main}
        stroke="white"
        strokeWidth={1.5}
      />
    </g>
  );
};

// Custom tick label with color indicator
const CustomTickLabel = (props: any) => {
  const { x, y, payload, textAnchor } = props;
  const color = skillColors[payload.value] || { main: "hsl(200, 90%, 55%)", glow: "rgba(100, 200, 255, 0.3)" };
  
  // Adjust text position based on location
  let adjustedY = y;
  let adjustedX = x;
  
  if (payload.value === "Pitch") {
    adjustedY = y - 6;
  } else if (payload.value === "Range") {
    adjustedY = y + 10;
  } else if (payload.value === "Breath") {
    adjustedX = x + 6;
  } else if (payload.value === "Rhythm") {
    adjustedX = x - 6;
  }
  
  return (
    <g transform={`translate(${adjustedX},${adjustedY})`}>
      {/* Small dot indicator */}
      <circle
        cx={textAnchor === "end" ? -6 : textAnchor === "start" ? 6 : 0}
        cy={payload.value === "Pitch" ? 10 : payload.value === "Range" ? -6 : 0}
        r={3}
        fill={color.main}
        style={{ filter: `drop-shadow(0 0 2px ${color.glow})` }}
      />
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="middle"
        fill={color.main}
        className="text-[10px] font-medium"
        style={{ 
          textShadow: `0 0 4px ${color.glow}`,
        }}
      >
        {payload.value}
      </text>
    </g>
  );
};

export function VocalProgressDiagram({
  overallProgress,
  level,
  skills,
  streak,
  sessions,
  className,
}: VocalProgressDiagramProps) {
  const { label: levelLabel, level: levelNumber } = levelConfig[level];

  // Transform skills data for radar chart
  const radarData = [
    { skill: "Pitch", value: skills.pitch, fullMark: 100 },
    { skill: "Breath", value: skills.breath, fullMark: 100 },
    { skill: "Range", value: skills.range, fullMark: 100 },
    { skill: "Rhythm", value: skills.rhythm, fullMark: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 bg-white/5 dark:bg-black/20 backdrop-blur-md border border-white/10",
        className
      )}
    >
      <div className="relative flex flex-col items-center">
        {/* Radar Chart Container - Compact */}
        <div className="relative h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <defs>
                {/* Multi-color gradient fill - more transparent */}
                <linearGradient id="radarFillEnhanced" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(190, 90%, 55%)" stopOpacity={0.2} />
                  <stop offset="25%" stopColor="hsl(160, 84%, 45%)" stopOpacity={0.15} />
                  <stop offset="50%" stopColor="hsl(270, 85%, 65%)" stopOpacity={0.2} />
                  <stop offset="75%" stopColor="hsl(32, 95%, 55%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(190, 90%, 55%)" stopOpacity={0.2} />
                </linearGradient>
                <filter id="radarGlowEnhanced" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              <PolarGrid
                stroke="hsl(200, 60%, 50%)"
                strokeOpacity={0.08}
                gridType="polygon"
              />
              
              <PolarAngleAxis
                dataKey="skill"
                tick={CustomTickLabel}
                stroke="transparent"
              />
              
              <Radar
                name="Progress"
                dataKey="value"
                stroke="url(#radarStrokeGradient)"
                strokeWidth={2}
                fill="url(#radarFillEnhanced)"
                filter="url(#radarGlowEnhanced)"
                dot={CustomDot}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              
              {/* Gradient stroke definition */}
              <defs>
                <linearGradient id="radarStrokeGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(190, 90%, 55%)" />
                  <stop offset="33%" stopColor="hsl(160, 84%, 45%)" />
                  <stop offset="66%" stopColor="hsl(270, 85%, 65%)" />
                  <stop offset="100%" stopColor="hsl(32, 95%, 55%)" />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Level Badge - Compact */}
        <motion.div
          className="mt-2 w-full max-w-[160px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div 
            className="relative flex items-center justify-center gap-2 rounded-xl px-3 py-2 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(167, 139, 250, 0.1) 50%, rgba(245, 158, 11, 0.1) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="relative z-10 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                <Trophy className="h-4 w-4 text-accent" />
              </div>
              <div className="text-left">
                <span className="text-base font-bold text-foreground">LV.{levelNumber}</span>
                <p className="text-[10px] text-muted-foreground">{levelLabel}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress percentage */}
        <motion.div
          className="mt-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-2 flex items-center justify-center gap-1">
            <span className="gradient-text text-2xl font-bold">{overallProgress}%</span>
            <span className="text-xs text-muted-foreground">Complete</span>
          </div>

          {/* Stats row - tighter */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15">
                <Trophy className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">{sessions}</p>
                <p className="text-[10px] text-muted-foreground">Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/15"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Flame className="h-3.5 w-3.5 text-destructive" />
              </motion.div>
              <div className="text-left">
                <p className="text-sm font-semibold">{streak}d</p>
                <p className="text-[10px] text-muted-foreground">Streak</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
