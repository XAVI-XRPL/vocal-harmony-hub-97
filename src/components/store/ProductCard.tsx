import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<string, string> = {
  "throat-care": "Throat",
  "hydration": "Hydration",
  "vitamins": "Vitamins",
  "accessories": "Gear",
  "apparel": "Apparel",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block relative overflow-hidden rounded-2xl",
        "dressing-room-card",
        "transition-all duration-300",
        product.isFeatured && "ring-1 ring-accent-store/30"
      )}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-accent-store/90 text-background text-[10px] font-semibold">
          Featured
        </div>
      )}

      {/* Category Badge */}
      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-background/60 backdrop-blur-sm text-[10px] font-medium text-muted-foreground">
        {categoryLabels[product.category]}
      </div>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted/20">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* External Link Icon */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-2 rounded-full bg-accent-store/90">
            <ExternalLink className="w-3.5 h-3.5 text-background" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Brand */}
        <p className="text-[10px] text-accent-store font-medium uppercase tracking-wider mb-0.5">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1.5 leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 text-accent-store fill-accent-store" />
          <span className="text-xs text-foreground font-medium">{product.rating}</span>
          <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Bottom Glow on Hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-store/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.a>
  );
}
