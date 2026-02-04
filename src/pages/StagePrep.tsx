import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Headphones, Mic2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PartnerBrandCarousel } from "@/components/stageprep/PartnerBrandCarousel";
import { GearGrid } from "@/components/stageprep/GearGrid";
import { PreShowChecklist } from "@/components/stageprep/PreShowChecklist";
import { GearCategoryFilter } from "@/components/stageprep/GearCategoryFilter";
import { mockBrands, mockGearProducts } from "@/data/mockBrands";
import { mockChecklist } from "@/data/mockChecklist";
import { GearCategory } from "@/types";

export default function StagePrep() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<GearCategory | "all">("all");

  const filteredGear = selectedCategory === "all"
    ? mockGearProducts
    : mockGearProducts.filter((g) => g.category === selectedCategory);

  const featuredGear = mockGearProducts.filter((g) => g.isFeatured);

  return (
    <div className="relative min-h-screen">
      {/* Backstage Theme Background */}
      <div className="fixed inset-0 backstage-bg" />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/95" />

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
              className="p-2 rounded-xl hover:bg-accent-stage/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent-stage/20 border border-accent-stage/30">
                <Headphones className="w-5 h-5 text-accent-stage" />
              </div>
              <div>
                <h1 className="text-xl font-bold stage-gradient-text">Stage Prep</h1>
                <p className="text-xs text-muted-foreground">Gear up for your best performance</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Partner Brands Section */}
        <section className="py-6">
          <div className="px-4 mb-4">
            <h2 className="text-lg font-semibold text-foreground">Partner Discounts</h2>
            <p className="text-xs text-muted-foreground mt-1">Exclusive deals for RVMT members</p>
          </div>
          <PartnerBrandCarousel brands={mockBrands} />
        </section>

        {/* Featured IEMs Hero */}
        <section className="px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backstage-card rounded-2xl p-6 overflow-hidden relative"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-stage/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Headphones className="w-5 h-5 text-accent-stage" />
                <span className="text-xs font-semibold text-accent-stage uppercase tracking-wider">Featured IEMs</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Pro-Grade In-Ears</h2>
              <p className="text-sm text-muted-foreground mb-4">
                The same monitors trusted by touring artists worldwide. Hear every note clearly.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mic2 className="w-3.5 h-3.5" />
                  {featuredGear.filter(g => g.category === 'iem').length} IEMs
                </span>
                <span className="flex items-center gap-1">
                  <Mic2 className="w-3.5 h-3.5" />
                  {featuredGear.filter(g => g.category === 'microphone').length} Mics
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Gear Category Filter */}
        <div className="px-4 py-4">
          <GearCategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Gear Grid */}
        <section className="px-4 py-2">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {selectedCategory === "all" ? "All Gear" : selectedCategory.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </h2>
          <GearGrid products={filteredGear} brands={mockBrands} />
        </section>

        {/* Pre-Show Checklist Section */}
        <section className="px-4 py-6 pb-32">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-accent-stage" />
            <h2 className="text-lg font-semibold text-foreground">Pre-Show Checklist</h2>
          </div>
          <PreShowChecklist items={mockChecklist} />
        </section>
      </div>
    </div>
  );
}
