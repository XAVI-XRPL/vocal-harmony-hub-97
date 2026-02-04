import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Stethoscope, Headphones, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const hubModules = [
  {
    title: "Vocal Rider Store",
    description: "Curated products for vocal health",
    icon: ShoppingBag,
    path: "/store",
    accentClass: "hub-accent-store",
  },
  {
    title: "Vocal Health",
    description: "Find ENT doctors & specialists",
    icon: Stethoscope,
    path: "/vocal-health",
    accentClass: "hub-accent-health",
  },
  {
    title: "Stage Prep",
    description: "IEMs, gear & pre-show checklists",
    icon: Headphones,
    path: "/stage-prep",
    accentClass: "hub-accent-stage",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function HomeHubCards() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-3"
    >
      {hubModules.map((module) => (
        <motion.button
          key={module.path}
          variants={cardVariants}
          onClick={() => navigate(module.path)}
          className={cn(
            "w-full relative overflow-hidden",
            "glass-card p-4 rounded-2xl",
            "flex items-center gap-4",
            "text-left transition-all duration-300",
            "group",
            module.accentClass
          )}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Accent Glow Background */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hub-card-glow" />

          {/* Icon Container */}
          <div className={cn(
            "relative z-10 flex-shrink-0",
            "w-12 h-12 rounded-xl",
            "flex items-center justify-center",
            "hub-icon-bg transition-all duration-300",
            "group-hover:scale-105"
          )}>
            <module.icon className="w-6 h-6 hub-icon-color" strokeWidth={1.5} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground mb-0.5 truncate">
              {module.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {module.description}
            </p>
          </div>

          {/* Arrow */}
          <ChevronRight 
            className={cn(
              "relative z-10 w-5 h-5 text-muted-foreground",
              "transition-all duration-300",
              "group-hover:translate-x-1 group-hover:text-foreground"
            )} 
          />

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      ))}
    </motion.div>
  );
}
