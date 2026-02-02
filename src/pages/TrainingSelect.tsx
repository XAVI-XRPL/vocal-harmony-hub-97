import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Wind, TrendingUp, Timer, Music, ChevronRight, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { mockSongs } from "@/data/mockSongs";
import { cn } from "@/lib/utils";

const trainingModules = [
  {
    id: "pitch",
    title: "Pitch Training",
    description: "Master pitch accuracy and intonation",
    icon: Target,
    exercises: 12,
    difficulty: "intermediate",
    colorClass: "bg-cyan-500/20 text-cyan-400",
    glowColor: "hsl(185, 80%, 50%)",
  },
  {
    id: "breath",
    title: "Breath Control",
    description: "Improve your breathing technique",
    icon: Wind,
    exercises: 8,
    difficulty: "beginner",
    colorClass: "bg-teal-500/20 text-teal-400",
    glowColor: "hsl(170, 70%, 45%)",
  },
  {
    id: "range",
    title: "Range Extension",
    description: "Expand your vocal range safely",
    icon: TrendingUp,
    exercises: 10,
    difficulty: "advanced",
    colorClass: "bg-violet-500/20 text-violet-400",
    glowColor: "hsl(280, 70%, 55%)",
  },
  {
    id: "rhythm",
    title: "Rhythm Training",
    description: "Perfect your timing and groove",
    icon: Timer,
    exercises: 6,
    difficulty: "beginner",
    colorClass: "bg-amber-500/20 text-amber-400",
    glowColor: "hsl(45, 90%, 50%)",
  },
];

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-amber-500/20 text-amber-400",
  advanced: "bg-red-500/20 text-red-400",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TrainingSelect() {
  const navigate = useNavigate();
  const songsAvailable = mockSongs.length;

  const handleModuleSelect = (moduleId: string) => {
    // For now, navigate to the first song's training mode
    // In a full implementation, this would go to module-specific training
    navigate(`/training/bouncing-on-a-blessing?module=${moduleId}`);
  };

  const handleFreestyle = () => {
    navigate("/library");
  };

  return (
    <div className="min-h-screen">
      <Header showSearch={false} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pb-8"
      >
        {/* Back button and title */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 py-4">
          <motion.button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl bg-glass border border-glass-border flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold">Training Modules</h1>
            <p className="text-sm text-muted-foreground">Choose your training focus</p>
          </div>
        </motion.div>

        {/* Training modules */}
        <motion.div variants={itemVariants} className="space-y-3 mb-6">
          {trainingModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <GlassCard
                  padding="md"
                  className="flex items-center gap-4"
                  onClick={() => handleModuleSelect(module.id)}
                  glow
                  glowColor="primary"
                >
                  {/* Icon */}
                  <motion.div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                      module.colorClass
                    )}
                    whileHover={{
                      boxShadow: `0 0 25px ${module.glowColor}`,
                    }}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{module.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {module.exercises} exercises
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full capitalize",
                          difficultyColors[module.difficulty as keyof typeof difficultyColors]
                        )}
                      >
                        {module.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 my-6"
        >
          <div className="flex-1 h-px bg-glass-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-glass-border" />
        </motion.div>

        {/* Freestyle Practice */}
        <motion.div variants={itemVariants}>
          <GlassCard
            padding="lg"
            className="relative overflow-hidden"
            onClick={handleFreestyle}
            glow
            glowColor="accent"
          >
            {/* Background decoration */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 15px hsl(var(--primary) / 0.3)",
                    "0 0 30px hsl(var(--primary) / 0.5)",
                    "0 0 15px hsl(var(--primary) / 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Music className="w-8 h-8 text-primary" />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Freestyle Practice</h3>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                  </motion.div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Practice with any song from your library
                </p>
                <p className="text-xs text-primary mt-1">
                  {songsAvailable} songs available
                </p>
              </div>

              <ChevronRight className="w-6 h-6 text-muted-foreground" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick tips */}
        <motion.div variants={itemVariants} className="mt-8">
          <GlassCard padding="md" hover={false} variant="outline">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Training Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Start with breath control exercises to warm up, then move to pitch
                  training. Always end with a freestyle session to apply what you've learned!
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
