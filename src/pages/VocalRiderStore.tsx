import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DressingRoomHero } from "@/components/store/DressingRoomHero";
import { CategoryFilter } from "@/components/store/CategoryFilter";
import { ProductGrid } from "@/components/store/ProductGrid";
import { mockProducts } from "@/data/mockProducts";
import { ProductCategory } from "@/types";

export default function VocalRiderStore() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");

  const filteredProducts = selectedCategory === "all"
    ? mockProducts
    : mockProducts.filter((p) => p.category === selectedCategory);

  const featuredProducts = mockProducts.filter((p) => p.isFeatured);

  return (
    <div className="relative min-h-screen">
      {/* Dressing Room Background */}
      <div className="fixed inset-0 dressing-room-bg" />
      
      {/* Warm Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" />

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
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
