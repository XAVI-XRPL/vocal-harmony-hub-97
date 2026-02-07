import React from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, Tag, Clock, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<string, string> = {
  "throat-care": "Throat",
  "hydration": "Hydration",
  "essential-oils": "Oils",
  "tea-honey": "Tea",
  "nasal-sinus": "Nasal",
  "allergy-wellness": "Allergy",
  "accessories": "Gear",
};

export const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.a
      href={product.isComingSoon ? undefined : product.affiliateUrl}
      target={product.isComingSoon ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={cn(
        "group block relative overflow-hidden rounded-2xl",
        "dressing-room-card",
        "transition-all duration-300",
        product.isFeatured && "ring-1 ring-accent-store/30",
        product.isComingSoon && "cursor-default opacity-80"
      )}
      whileHover={product.isComingSoon ? {} : { y: -4 }}
      whileTap={product.isComingSoon ? {} : { scale: 0.98 }}
    >
      {/* Featured Badge */}
      {product.isFeatured && !product.isComingSoon && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-accent-store/90 text-background text-[10px] font-semibold flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Featured
        </div>
      )}

      {/* Coming Soon Badge */}
      {product.isComingSoon && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          Coming Soon
        </div>
      )}

      {/* Partner Brand Badge */}
      {product.isPartnerBrand && !product.isComingSoon && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-semibold">
          Partner
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
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            !product.isComingSoon && "group-hover:scale-110"
          )}
          loading="lazy"
          decoding="async"
        />
        
        {/* Hover Overlay */}
        {!product.isComingSoon && (
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        
        {/* External Link Icon */}
        {!product.isComingSoon && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-2 rounded-full bg-accent-store/90">
              <ExternalLink className="w-3.5 h-3.5 text-background" />
            </div>
          </div>
        )}
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
          <span className="text-[10px] text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price & Discount Code */}
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="text-base font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          
          {/* Discount Code Badge */}
          {product.discountCode && !product.isComingSoon && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent-store/20 text-accent-store">
              <Tag className="w-2.5 h-2.5" />
              <span className="text-[9px] font-semibold">{product.discountCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Glow on Hover */}
      {!product.isComingSoon && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-store/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.a>
  );
});
