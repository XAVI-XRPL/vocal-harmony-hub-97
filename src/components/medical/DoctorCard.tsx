import React from "react";
import { motion } from "framer-motion";
import { Star, Phone, ExternalLink, Zap, MapPin } from "lucide-react";
import { Doctor } from "@/types";
import { cn } from "@/lib/utils";
import { EMTBadge } from "./EMTBadge";

interface DoctorCardProps {
  doctor: Doctor;
}

const specialtyColors: Record<string, string> = {
  "Laryngologist": "bg-accent-medical/20 text-accent-medical",
  "ENT": "bg-blue-500/20 text-blue-400",
  "Voice Therapist": "bg-purple-500/20 text-purple-400",
  "Vocal Coach": "bg-amber-500/20 text-amber-400",
};

export const DoctorCard = React.memo(function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <motion.div
      className={cn(
        "medical-card rounded-xl p-4",
        "border-l-2 border-l-accent-medical",
        "transition-all duration-300 hover:border-l-4"
      )}
      whileHover={{ x: 2 }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            className="w-14 h-14 rounded-xl object-cover"
            loading="lazy"
            decoding="async"
          />
          {doctor.acceptsEmergency && (
            <div className="absolute -top-1 -right-1">
              <EMTBadge size="sm" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name & Credentials */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground truncate">
                {doctor.name}
              </h3>
              <p className="text-xs text-muted-foreground">{doctor.credentials}</p>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3 h-3 text-accent-medical fill-accent-medical" />
              <span className="text-xs font-medium text-foreground">{doctor.rating}</span>
            </div>
          </div>

          {/* Specialty Badge */}
          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full",
              specialtyColors[doctor.specialty] || "bg-muted text-muted-foreground"
            )}>
              {doctor.specialty}
            </span>
            
            {doctor.touringArtistFriendly && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                Tour-Friendly
              </span>
            )}
          </div>

          {/* Practice */}
          <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
            {doctor.practice}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-3">
            <a
              href={`tel:${doctor.phone}`}
              className="flex items-center gap-1.5 text-xs text-accent-medical hover:underline"
            >
              <Phone className="w-3 h-3" />
              Call
            </a>
            <a
              href={doctor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3 h-3" />
              Website
            </a>
            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <MapPin className="w-3 h-3" />
              {doctor.reviewCount} reviews
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
