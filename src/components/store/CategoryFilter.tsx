import { motion } from "framer-motion";
import { ProductCategory } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: ProductCategory | "all";
  onSelectCategory: (category: ProductCategory | "all") => void;
}

const categories: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "throat-care", label: "Throat Care" },
  { id: "hydration", label: "Hydration" },
  { id: "vitamins", label: "Vitamins" },
  { id: "accessories", label: "Accessories" },
  { id: "apparel", label: "Apparel" },
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
                "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
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
              <span className="relative z-10">{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
