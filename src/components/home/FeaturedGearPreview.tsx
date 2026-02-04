import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Headphones, ChevronRight } from "lucide-react";
import { mockGearProducts, mockBrands } from "@/data/mockBrands";

export function FeaturedGearPreview() {
  const navigate = useNavigate();
  const featuredGear = mockGearProducts.filter((g) => g.isFeatured && g.category === "iem").slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent-stage/20">
            <Headphones className="w-4 h-4 text-accent-stage" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Prep for the Stage</h2>
        </div>
        <button
          onClick={() => navigate("/stage-prep")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
        <div className="flex gap-3 pb-2">
          {featuredGear.map((product, index) => {
            const brand = mockBrands.find((b) => b.id === product.brandId);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate("/stage-prep")}
                className="flex-shrink-0 w-40 glass-card rounded-xl overflow-hidden cursor-pointer hover:border-accent-stage/30 transition-all"
              >
                <div className="relative aspect-square">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-semibold text-white line-clamp-1">{product.name}</p>
                    {brand && (
                      <p className="text-[10px] text-white/70">{brand.name}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
