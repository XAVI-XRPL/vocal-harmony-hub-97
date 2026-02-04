import { motion } from "framer-motion";
import { City } from "@/types";
import { CityMarker } from "./CityMarker";

interface USAMapProps {
  cities: City[];
  selectedCity: City | null;
  onCitySelect: (city: City | null) => void;
}

export function USAMap({ cities, selectedCity, onCitySelect }: USAMapProps) {
  return (
    <div className="relative w-full aspect-[1.6/1] max-w-lg mx-auto">
      {/* SVG Map */}
      <svg
        viewBox="0 0 100 62"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified USA Outline */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d="M5 20 
             L8 15 L12 12 L15 10 L20 8 L25 7 L30 8 L35 10 
             L40 12 L45 11 L50 10 L55 9 L60 10 L65 12 L70 14 
             L75 16 L80 18 L85 20 L88 22 L90 25 L92 28 
             L90 32 L88 35 L85 38 L82 42 L80 45 L78 48 
             L76 52 L74 55 L72 58 L70 60 
             L65 58 L60 55 L55 52 L50 50 L45 52 L40 55 
             L35 58 L30 60 L25 58 L20 55 L15 52 L12 48 
             L10 45 L8 40 L6 35 L5 30 L4 25 Z"
          fill="none"
          stroke="hsl(var(--accent-medical) / 0.3)"
          strokeWidth="0.5"
          className="drop-shadow-[0_0_8px_hsl(var(--accent-medical)/0.2)]"
        />

        {/* Grid Lines for Reference */}
        <g stroke="hsl(var(--muted-foreground) / 0.1)" strokeWidth="0.1">
          {[20, 40, 60, 80].map((x) => (
            <line key={`v-${x}`} x1={x} y1="5" x2={x} y2="60" />
          ))}
          {[15, 30, 45].map((y) => (
            <line key={`h-${y}`} x1="5" y1={y} x2="95" y2={y} />
          ))}
        </g>

        {/* City Markers */}
        {cities.map((city) => (
          <CityMarker
            key={city.id}
            city={city}
            isSelected={selectedCity?.id === city.id}
            onSelect={() => onCitySelect(selectedCity?.id === city.id ? null : city)}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent-medical/60" />
          <span>City</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-medical animate-pulse" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
