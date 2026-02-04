import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, Star } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";

export function VocalRiderPicks() {
  const navigate = useNavigate();
  const picks = mockProducts.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent-store/20">
            <ShoppingBag className="w-4 h-4 text-accent-store" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Dressing Room Essentials</h2>
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
            <div className="aspect-square rounded-xl overflow-hidden glass-card border-transparent hover:border-accent-store/30 transition-all">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
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
