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
  Pitch: { main: "hsl(190, 90%, 55%)", glow: "rgba(34, 211, 238, 0.4)" },
  Breath: { main: "hsl(160, 84%, 45%)", glow: "rgba(16, 185, 129, 0.4)" },
  Range: { main: "hsl(270, 85%, 65%)", glow: "rgba(167, 139, 250, 0.4)" },
  Rhythm: { main: "hsl(32, 95%, 55%)", glow: "rgba(245, 158, 11, 0.4)" },
};

// Custom dot component for multi-colored radar points
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = skillColors[payload.skill] || { main: "hsl(200, 90%, 55%)", glow: "rgba(100, 200, 255, 0.4)" };
  
  return (
    <g>
      {/* Glow effect */}
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={color.glow}
        style={{ filter: "blur(3px)" }}
      />
      {/* Main dot */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={color.main}
        stroke="white"
        strokeWidth={2}
      />
    </g>
  );
};

// Custom tick label with color indicator
const CustomTickLabel = (props: any) => {
  const { x, y, payload, textAnchor } = props;
  const color = skillColors[payload.value] || { main: "hsl(200, 90%, 55%)", glow: "rgba(100, 200, 255, 0.4)" };
  
  // Adjust text position based on location
  let adjustedY = y;
  let adjustedX = x;
  
  if (payload.value === "Pitch") {
    adjustedY = y - 8;
  } else if (payload.value === "Range") {
    adjustedY = y + 12;
  } else if (payload.value === "Breath") {
    adjustedX = x + 8;
  } else if (payload.value === "Rhythm") {
    adjustedX = x - 8;
  }
  
  return (
    <g transform={`translate(${adjustedX},${adjustedY})`}>
      {/* Glowing dot indicator */}
      <circle
        cx={textAnchor === "end" ? -8 : textAnchor === "start" ? 8 : 0}
        cy={payload.value === "Pitch" ? 12 : payload.value === "Range" ? -8 : 0}
        r={4}
        fill={color.main}
        style={{ filter: `drop-shadow(0 0 4px ${color.glow})` }}
      />
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="middle"
        fill={color.main}
        className="text-xs font-semibold"
        style={{ 
          textShadow: `0 0 8px ${color.glow}`,
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
        "glass-card-3d relative overflow-hidden rounded-3xl p-6",
        className
      )}
    >
      {/* Shine overlay */}
      <div className="card-shine pointer-events-none absolute inset-0 rounded-3xl" />
      
      {/* Glass inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent" />

      <div className="relative flex flex-col items-center">
        {/* Radar Chart Container - No overlapping badge */}
        <div className="relative h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
              <defs>
                {/* Multi-color gradient fill */}
                <linearGradient id="radarFillEnhanced" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(190, 90%, 55%)" stopOpacity={0.4} />
                  <stop offset="25%" stopColor="hsl(160, 84%, 45%)" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="hsl(270, 85%, 65%)" stopOpacity={0.4} />
                  <stop offset="75%" stopColor="hsl(32, 95%, 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(190, 90%, 55%)" stopOpacity={0.4} />
                </linearGradient>
                <filter id="radarGlowEnhanced" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              <PolarGrid
                stroke="hsl(200, 60%, 50%)"
                strokeOpacity={0.15}
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
                strokeWidth={2.5}
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

        {/* Level Badge - Separated below chart */}
        <motion.div
          className="mt-2 w-full max-w-[200px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div 
            className="relative flex items-center justify-center gap-3 rounded-2xl px-5 py-3 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(167, 139, 250, 0.15) 50%, rgba(245, 158, 11, 0.15) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Animated gradient border effect */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: "linear-gradient(90deg, hsl(190, 90%, 55%), hsl(160, 84%, 45%), hsl(270, 85%, 65%), hsl(32, 95%, 55%), hsl(190, 90%, 55%))",
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "200% 0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/30">
                <Trophy className="h-5 w-5 text-accent" />
              </div>
              <div className="text-left">
                <span className="text-lg font-bold text-foreground">LV.{levelNumber}</span>
                <p className="text-xs text-muted-foreground">{levelLabel}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress percentage */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-3 flex items-center justify-center gap-1">
            <span className="gradient-text text-3xl font-bold">{overallProgress}%</span>
            <span className="text-sm text-muted-foreground">Complete</span>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
                <Trophy className="h-4 w-4 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-semibold">{sessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Flame className="h-4 w-4 text-destructive" />
              </motion.div>
              <div className="text-left">
                <p className="font-semibold">{streak} days</p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
