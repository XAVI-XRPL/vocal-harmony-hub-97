import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, Star, Tag } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export function VocalRiderPicks() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts({ featured: true });
  
  const picks = (products || []).filter((p) => !p.isComingSoon).slice(0, 4);

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent-store/20">
              <ShoppingBag className="w-4 h-4 text-accent-store" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Kimad Essentials</h2>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-3 w-full mt-1.5" />
              <Skeleton className="h-2 w-12 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent-store/20">
            <ShoppingBag className="w-4 h-4 text-accent-store" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Kimad Essentials</h2>
        </div>
        <button
          onClick={() => navigate("/store")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Shop All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {picks.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => navigate("/store")}
            className="cursor-pointer group"
          >
            <div className="aspect-square rounded-xl overflow-hidden glass-card border-transparent hover:border-accent-store/30 transition-all relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.discountCode && (
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-center gap-0.5 px-1 py-0.5 rounded bg-accent-store/90 text-background">
                  <Tag className="w-2 h-2" />
                  <span className="text-[7px] font-bold truncate">{product.discountCode}</span>
                </div>
              )}
            </div>
            <div className="mt-1.5 px-0.5">
              <p className="text-[10px] font-medium text-foreground line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-1">
                <Star className="w-2.5 h-2.5 text-accent-store fill-accent-store" />
                <span className="text-[9px] text-muted-foreground">{product.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
