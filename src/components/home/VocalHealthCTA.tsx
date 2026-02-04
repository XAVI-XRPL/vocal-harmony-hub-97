import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, ChevronRight } from "lucide-react";
import { EMTBadge } from "@/components/medical/EMTBadge";
import { GlassCard } from "@/components/ui/glass-card";

export function VocalHealthCTA() {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <GlassCard
        padding="md"
        className="cursor-pointer border-accent-medical/20 hover:border-accent-medical/40 transition-all relative overflow-hidden"
        onClick={() => navigate("/vocal-health")}
      >
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-medical/10 rounded-full blur-3xl" />
        
        <div className="relative flex items-center gap-4">
          {/* EMT Badge */}
          <EMTBadge size="lg" />

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">Vocal Health Directory</h3>
            <p className="text-xs text-muted-foreground mb-2">
              Find ENT doctors & voice specialists near your next venue.
            </p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                13 cities
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                15+ specialists
              </span>
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </GlassCard>
    </motion.div>
  );
}
