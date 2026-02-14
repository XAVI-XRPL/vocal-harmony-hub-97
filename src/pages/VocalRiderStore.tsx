import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DressingRoomHero } from "@/components/store/DressingRoomHero";
import { CategoryFilter } from "@/components/store/CategoryFilter";
import { ProductGrid } from "@/components/store/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { ProductCategory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { VocalNotesDeskBackground } from "@/components/layout/VocalNotesDeskBackground";

export default function VocalRiderStore() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  
  const { data: products, isLoading } = useProducts({ category: selectedCategory });
  const { data: allProducts } = useProducts();

  const featuredProducts = (allProducts || []).filter((p) => p.isFeatured);

  return (
    <>
      {/* Vocal Notes Desk Background */}
      <VocalNotesDeskBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 px-4 py-4 header-glass"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/hub")}
              className="p-2 rounded-xl hover:bg-accent-store/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold store-gradient-text">Vocal Rider Store</h1>
              <p className="text-xs text-muted-foreground">Curated essentials for the touring vocalist</p>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <DressingRoomHero featuredCount={featuredProducts.length} />

        {/* Category Filter */}
        <div className="px-4 py-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Product Grid */}
        <div className="px-4 pb-32">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </div>
      </div>
    </>
  );
}
