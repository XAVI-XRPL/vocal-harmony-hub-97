import { motion } from "framer-motion";
import { Star, ExternalLink, Tag } from "lucide-react";
import { GearProduct, PartnerBrand } from "@/types";
import { cn } from "@/lib/utils";

interface GearProductCardProps {
  product: GearProduct;
  brand?: PartnerBrand;
}

const categoryColors: Record<string, string> = {
  iem: "bg-accent-stage/20 text-accent-stage",
  microphone: "bg-purple-500/20 text-purple-400",
  cable: "bg-blue-500/20 text-blue-400",
  case: "bg-amber-500/20 text-amber-400",
  accessories: "bg-green-500/20 text-green-400",
  "in-ear-monitor": "bg-accent-stage/20 text-accent-stage",
};

export function GearProductCard({ product, brand }: GearProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <motion.a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block backstage-card rounded-xl overflow-hidden",
        "transition-all duration-300 hover:border-accent-stage/40",
        product.isFeatured && "ring-1 ring-accent-stage/30"
      )}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-2 left-2">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent-stage text-background text-[9px] font-semibold">
              <Star className="w-2.5 h-2.5 fill-current" />
              Featured
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide",
            categoryColors[product.category] || "bg-muted text-muted-foreground"
          )}>
            {product.category}
          </span>
        </div>

        {/* Price */}
        <div className="absolute bottom-2 right-2">
          <span className="text-sm font-bold text-white drop-shadow-lg">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Brand */}
        {brand && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="w-4 h-4 rounded object-cover"
            />
            <span className="text-[10px] text-muted-foreground">{brand.name}</span>
            {brand.discountPercent > 0 && (
              <span className="flex items-center gap-0.5 text-[9px] text-accent-stage font-medium ml-auto">
                <Tag className="w-2.5 h-2.5" />
                {brand.discountPercent}%
              </span>
            )}
          </div>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-accent-stage font-medium flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Shop Now
          </span>
        </div>
      </div>
    </motion.a>
  );
}
