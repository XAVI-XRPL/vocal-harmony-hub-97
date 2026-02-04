import { motion } from "framer-motion";
import { Headphones, Mic2, Cable, Briefcase, Package } from "lucide-react";
import { GearCategory } from "@/types";
import { cn } from "@/lib/utils";

interface GearCategoryFilterProps {
  selectedCategory: GearCategory | "all";
  onSelectCategory: (category: GearCategory | "all") => void;
}

const categories: { id: GearCategory | "all"; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Package },
  { id: "iem", label: "IEMs", icon: Headphones },
  { id: "microphone", label: "Mics", icon: Mic2 },
  { id: "cable", label: "Cables", icon: Cable },
  { id: "case", label: "Cases", icon: Briefcase },
  { id: "accessories", label: "Accessories", icon: Package },
];

export function GearCategoryFilter({ selectedCategory, onSelectCategory }: GearCategoryFilterProps) {
  return (
    <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
      <div className="flex gap-2 pb-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const Icon = category.icon;

          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                "transition-all duration-300 whitespace-nowrap flex-shrink-0",
                isSelected
                  ? "bg-accent-stage text-background shadow-lg shadow-accent-stage/25"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
