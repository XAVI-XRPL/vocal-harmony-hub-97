import { motion } from "framer-motion";
import { ProductCategory } from "@/types";
import { cn } from "@/lib/utils";
import { 
  Pill, 
  Droplets, 
  Leaf, 
  Coffee, 
  Wind, 
  Heart, 
  Briefcase 
} from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: ProductCategory | "all";
  onSelectCategory: (category: ProductCategory | "all") => void;
}

const categories: { id: ProductCategory | "all"; label: string; icon?: React.ReactNode }[] = [
  { id: "all", label: "All" },
  { id: "throat-care", label: "Throat Care", icon: <Pill className="w-3.5 h-3.5" /> },
  { id: "hydration", label: "Hydration", icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: "essential-oils", label: "Essential Oils", icon: <Leaf className="w-3.5 h-3.5" /> },
  { id: "tea-honey", label: "Tea & Honey", icon: <Coffee className="w-3.5 h-3.5" /> },
  { id: "nasal-sinus", label: "Nasal Care", icon: <Wind className="w-3.5 h-3.5" /> },
  { id: "allergy-wellness", label: "Allergy", icon: <Heart className="w-3.5 h-3.5" /> },
  { id: "accessories", label: "Accessories", icon: <Briefcase className="w-3.5 h-3.5" /> },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
      <div className="flex gap-2 pb-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                "transition-all duration-300",
                isSelected
                  ? "text-background"
                  : "text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50"
              )}
              whileTap={{ scale: 0.95 }}
            >
              {isSelected && (
                <motion.div
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full store-pill-bg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {category.icon && <span className="relative z-10">{category.icon}</span>}
              <span className="relative z-10">{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
