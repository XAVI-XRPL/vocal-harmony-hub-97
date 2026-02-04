import { motion } from "framer-motion";
import { City } from "@/types";

interface CityMarkerProps {
  city: City;
  isSelected: boolean;
  onSelect: () => void;
}

export function CityMarker({ city, isSelected, onSelect }: CityMarkerProps) {
  return (
    <g
      className="cursor-pointer"
      onClick={onSelect}
    >
      {/* Pulse Ring for Selected */}
      {isSelected && (
        <motion.circle
          cx={city.svgX}
          cy={city.svgY}
          r={4}
          fill="none"
          stroke="hsl(var(--accent-medical))"
          strokeWidth="0.5"
          initial={{ r: 2, opacity: 1 }}
          animate={{ r: 6, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* Outer Glow */}
      <motion.circle
        cx={city.svgX}
        cy={city.svgY}
        r={isSelected ? 3 : 2}
        fill="hsl(var(--accent-medical) / 0.3)"
        initial={false}
        animate={{
          r: isSelected ? 4 : 2.5,
          opacity: isSelected ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main Dot */}
      <motion.circle
        cx={city.svgX}
        cy={city.svgY}
        r={isSelected ? 2 : 1.2}
        fill="hsl(var(--accent-medical))"
        initial={false}
        animate={{
          r: isSelected ? 2.5 : 1.5,
          filter: isSelected ? "drop-shadow(0 0 4px hsl(var(--accent-medical)))" : "none",
        }}
        whileHover={{ r: 2.5 }}
        transition={{ duration: 0.2 }}
      />

      {/* City Label (shown on hover/select) */}
      {isSelected && (
        <motion.g
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <rect
            x={city.svgX - 8}
            y={city.svgY - 8}
            width={16}
            height={5}
            rx={1}
            fill="hsl(var(--background) / 0.9)"
            stroke="hsl(var(--accent-medical) / 0.5)"
            strokeWidth="0.3"
          />
          <text
            x={city.svgX}
            y={city.svgY - 4.5}
            textAnchor="middle"
            fontSize="2.5"
            fill="hsl(var(--foreground))"
            fontWeight="600"
          >
            {city.abbreviation}
          </text>
        </motion.g>
      )}
    </g>
  );
}
