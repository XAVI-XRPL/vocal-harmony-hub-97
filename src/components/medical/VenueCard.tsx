import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import { Venue } from "@/types";
import { cn } from "@/lib/utils";

interface VenueCardProps {
  venue: Venue;
}

const venueTypeLabels: Record<string, string> = {
  arena: "Arena",
  stadium: "Stadium",
  theater: "Theater",
  club: "Club",
};

const venueTypeColors: Record<string, string> = {
  arena: "bg-purple-500/20 text-purple-400",
  stadium: "bg-blue-500/20 text-blue-400",
  theater: "bg-amber-500/20 text-amber-400",
  club: "bg-green-500/20 text-green-400",
};

export function VenueCard({ venue }: VenueCardProps) {
  const formattedCapacity = venue.capacity >= 1000
    ? `${(venue.capacity / 1000).toFixed(venue.capacity >= 10000 ? 0 : 1)}K`
    : venue.capacity.toString();

  return (
    <motion.div
      className={cn(
        "flex-shrink-0 w-48",
        "medical-card rounded-xl overflow-hidden",
        "transition-all duration-300"
      )}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative h-24 overflow-hidden">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide",
            venueTypeColors[venue.type]
          )}>
            {venueTypeLabels[venue.type]}
          </span>
        </div>

        {/* Capacity */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <Users className="w-3 h-3 text-white/80" />
          <span className="text-xs font-medium text-white">{formattedCapacity}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
          {venue.name}
        </h3>
        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          <span className="line-clamp-1">{venue.address.split(",")[1]?.trim() || venue.address}</span>
        </p>
      </div>
    </motion.div>
  );
}
