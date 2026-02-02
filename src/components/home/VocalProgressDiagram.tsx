import { motion } from "framer-motion";
import { Mic, Wind, TrendingUp, Timer, Flame, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
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

const skillConfig = [
  { key: "pitch", label: "Pitch", icon: Mic, angle: -45 },
  { key: "breath", label: "Breath", icon: Wind, angle: 45 },
  { key: "range", label: "Range", icon: TrendingUp, angle: 135 },
  { key: "rhythm", label: "Rhythm", icon: Timer, angle: 225 },
] as const;

const levelConfig = {
  beginner: { label: "Beginner", color: "hsl(var(--primary))", level: 1 },
  intermediate: { label: "Intermediate", color: "hsl(var(--accent))", level: 2 },
  advanced: { label: "Advanced", color: "hsl(210, 85%, 65%)", level: 3 },
};

export function VocalProgressDiagram({
  overallProgress,
  level,
  skills,
  streak,
  sessions,
  className,
}: VocalProgressDiagramProps) {
  const size = 240;
  const center = size / 2;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - overallProgress / 100);

  const calculateSkillPosition = (angle: number, distance: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + Math.cos(rad) * distance,
      y: center + Math.sin(rad) * distance,
    };
  };

  const { label: levelLabel, level: levelNumber } = levelConfig[level];

  return (
    <GlassCard padding="lg" hover={false} className={cn("overflow-visible", className)}>
      <div className="flex flex-col items-center">
        {/* SVG Progress Ring */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
          >
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(195, 85%, 50%)" />
                <stop offset="50%" stopColor="hsl(200, 90%, 55%)" />
                <stop offset="100%" stopColor="hsl(220, 75%, 70%)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="hsl(var(--muted) / 0.3)"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress ring */}
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progressOffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              filter="url(#glow)"
            />
          </svg>

          {/* Skill indicators positioned around the ring */}
          {skillConfig.map((skill, index) => {
            const pos = calculateSkillPosition(skill.angle, radius + 35);
            const Icon = skill.icon;
            const value = skills[skill.key as keyof SkillData];

            return (
              <motion.div
                key={skill.key}
                className="absolute flex flex-col items-center"
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    "bg-primary/20 border border-primary/30"
                  )}
                  animate={{
                    boxShadow: [
                      "0 0 10px hsl(var(--primary) / 0.2)",
                      "0 0 20px hsl(var(--primary) / 0.4)",
                      "0 0 10px hsl(var(--primary) / 0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <Icon className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="text-[10px] text-muted-foreground mt-1 font-medium">
                  {skill.label}
                </span>
                <span className="text-xs font-bold text-foreground">{value}%</span>
              </motion.div>
            );
          })}

          {/* Center content */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 rounded-2xl bg-glass border border-glass-border flex flex-col items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px hsl(var(--primary) / 0.2)",
                  "0 0 40px hsl(var(--primary) / 0.3)",
                  "0 0 20px hsl(var(--primary) / 0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Trophy className="w-6 h-6 text-primary mb-1" />
              <span className="text-lg font-bold">LV.{levelNumber}</span>
              <span className="text-[10px] text-muted-foreground">{levelLabel}</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Progress percentage */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-3xl font-bold gradient-text">{overallProgress}%</span>
            <span className="text-sm text-muted-foreground">Complete</span>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-semibold">{sessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Flame className="w-4 h-4 text-orange-500" />
              </motion.div>
              <div className="text-left">
                <p className="font-semibold">{streak} days</p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
}
