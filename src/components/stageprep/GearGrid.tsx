import { motion } from "framer-motion";
import { GearProduct, PartnerBrand } from "@/types";
import { GearProductCard } from "./GearProductCard";

interface GearGridProps {
  products: GearProduct[];
  brands: PartnerBrand[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export function GearGrid({ products, brands }: GearGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No gear found in this category</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3"
    >
      {products.map((product) => {
        const brand = brands.find((b) => b.id === product.brandId);
        return (
          <motion.div key={product.id} variants={itemVariants}>
            <GearProductCard product={product} brand={brand} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
