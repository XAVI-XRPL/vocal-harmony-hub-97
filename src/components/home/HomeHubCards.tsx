import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, Stethoscope, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const hubModules = [
  {
    title: "Store",
    icon: Mic,
    path: "/store",
    color: "#22c55e", // green
  },
  {
    title: "Vocal Health",
    icon: Stethoscope,
    path: "/vocal-health",
    color: "#ef4444", // red
  },
  {
    title: "Stage Prep",
    icon: Headphones,
    path: "/stage-prep",
    color: "#14b8a6", // teal
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
            boxShadow: `0 8px 30px ${module.color}40`,
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            ["--card-accent" as string]: module.color,
          }}
        >
          {/* Glow Background on Hover */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `radial-gradient(circle at center, ${module.color}20 0%, transparent 70%)`,
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
              boxShadow: `0 0 0 1px ${module.color}30`,
            }}
            whileHover={{
              boxShadow: `0 0 20px ${module.color}50`,
            }}
          >
            <module.icon 
              className="w-6 h-6 transition-all duration-300"
              style={{ color: module.color }}
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
