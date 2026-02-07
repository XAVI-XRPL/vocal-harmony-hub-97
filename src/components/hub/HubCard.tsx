import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HubCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  accentClass: string;
}

export function HubCard({ title, description, icon: Icon, path, accentClass }: HubCardProps) {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(path)}
      className={cn(
        "w-full relative overflow-hidden",
        "glass-card-3d p-6 rounded-2xl",
        "flex items-center gap-5",
        "text-left transition-all duration-300",
        "group",
        accentClass
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Accent Glow Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hub-card-glow" />

      {/* Icon Container */}
      <div className={cn(
        "relative z-10 flex-shrink-0",
        "w-16 h-16 rounded-2xl",
        "flex items-center justify-center",
        "hub-icon-bg transition-all duration-300",
        "group-hover:scale-105"
      )}>
        <Icon className="w-8 h-8 hub-icon-color" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 min-w-0">
        <h3 className="text-xl font-bold text-foreground mb-0.5 truncate drop-shadow-md"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground/90 line-clamp-1">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight 
        className={cn(
          "relative z-10 w-6 h-6 text-muted-foreground",
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
  );
}
