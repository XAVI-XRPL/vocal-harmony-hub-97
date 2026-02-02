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
        {/* Radar Chart Container */}
        <div className="relative h-[260px] w-full">
          {/* Level Badge - Centered over chart */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="glass-card-3d-inner flex h-20 w-20 flex-col items-center justify-center rounded-2xl">
              <Trophy className="mb-1 h-5 w-5 text-primary" />
              <span className="text-lg font-bold">LV.{levelNumber}</span>
              <span className="text-[10px] text-muted-foreground">{levelLabel}</span>
            </div>
          </motion.div>

          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <defs>
                <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(195, 85%, 50%)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(220, 75%, 70%)" stopOpacity={0.2} />
                </linearGradient>
                <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
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
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={4}
                      textAnchor="middle"
                      className="fill-muted-foreground text-xs font-medium"
                    >
                      {payload.value}
                    </text>
                  </g>
                )}
                stroke="hsl(200, 60%, 50%)"
                strokeOpacity={0.2}
              />
              
              <Radar
                name="Progress"
                dataKey="value"
                stroke="hsl(200, 90%, 55%)"
                strokeWidth={2}
                fill="url(#radarFill)"
                filter="url(#radarGlow)"
                dot={{
                  r: 4,
                  fill: "hsl(200, 90%, 55%)",
                  stroke: "white",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "hsl(200, 90%, 65%)",
                  stroke: "white",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress percentage */}
        <motion.div
          className="mt-2 text-center"
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
