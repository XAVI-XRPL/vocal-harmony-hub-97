import { motion } from "framer-motion";
import { ExternalLink, Tag } from "lucide-react";
import { PartnerBrand } from "@/types";

interface PartnerBrandCarouselProps {
  brands: PartnerBrand[];
}

export function PartnerBrandCarousel({ brands }: PartnerBrandCarouselProps) {
  return (
    <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
      <div className="flex gap-4 pb-2">
        {brands.map((brand, index) => (
          <motion.a
            key={brand.id}
            href={brand.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex-shrink-0 w-56 backstage-card rounded-xl p-4 transition-all duration-300 hover:border-accent-stage/40 group"
          >
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent-stage transition-colors">
                  {brand.name}
                </h3>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ExternalLink className="w-2.5 h-2.5" />
                  Visit Store
                </p>
              </div>
            </div>

            {/* Discount Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent-stage/20 text-accent-stage text-xs font-semibold">
                <Tag className="w-3 h-3" />
                {brand.discountPercent}% OFF
              </span>
              <code className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                {brand.discountCode}
              </code>
            </div>

            {/* Description */}
            <p className="text-[11px] text-muted-foreground line-clamp-2">
              {brand.description}
            </p>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
