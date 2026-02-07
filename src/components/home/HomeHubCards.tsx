import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, Stethoscope, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const hubModules = [
  {
    title: "Store",
    icon: Mic,
    path: "/store",
    colorVar: "--accent-store",
    fallback: "hsl(30 55% 70%)",
  },
  {
    title: "Vocal Health",
    icon: Stethoscope,
    path: "/vocal-health",
    colorVar: "--accent-medical",
    fallback: "hsl(0 84% 60%)",
  },
  {
    title: "Stage Prep",
    icon: Headphones,
    path: "/stage-prep",
    colorVar: "--accent-gear",
    fallback: "hsl(187 85% 53%)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    }
  },
};

export function HomeHubCards() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-3"
    >
      {hubModules.map((module) => (
        <motion.button
          key={module.path}
          variants={cardVariants}
          onClick={() => navigate(module.path)}
          className={cn(
            "relative overflow-hidden",
            "glass-card p-4 rounded-2xl",
            "flex flex-col items-center justify-center gap-2",
            "text-center transition-all duration-300",
            "group aspect-square"
          )}
          whileHover={{ 
            y: -4, 
            scale: 1.02,
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            ["--card-accent" as string]: module.fallback,
          }}
        >
          {/* Glow Background on Hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `radial-gradient(circle at center, ${module.fallback} / 0.12, transparent 70%)`,
            }}
          />

          {/* Icon Container with Pulse */}
          <motion.div
            className={cn(
              "relative z-10",
              "w-12 h-12 rounded-xl",
              "flex items-center justify-center",
              "bg-white/10 backdrop-blur-sm",
              "transition-all duration-300",
              "group-hover:scale-110"
            )}
            style={{
              boxShadow: `0 0 0 1px ${module.fallback} / 0.3`,
            }}
          >
            <module.icon 
              className="w-6 h-6 transition-all duration-300"
              style={{ color: module.fallback }}
              strokeWidth={1.5} 
            />
          </motion.div>

          {/* Title */}
          <span className="relative z-10 text-sm font-medium text-foreground truncate w-full">
            {module.title}
          </span>

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      ))}
    </motion.div>
  );
}
