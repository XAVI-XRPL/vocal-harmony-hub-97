import { motion } from "framer-motion";
import { ShoppingBag, Stethoscope, Headphones } from "lucide-react";
import { HubCard } from "@/components/hub/HubCard";
import { VocalNotesDeskBackground } from "@/components/layout/VocalNotesDeskBackground";

const hubModules = [
  {
    id: "store",
    title: "Vocal Rider Store",
    description: "Curated products for the touring vocalist",
    icon: ShoppingBag,
    path: "/store",
    accentClass: "hub-accent-store",
  },
  {
    id: "health",
    title: "Vocal Health",
    description: "Find ENT doctors near your next venue",
    icon: Stethoscope,
    path: "/vocal-health",
    accentClass: "hub-accent-medical",
  },
  {
    id: "stage-prep",
    title: "Stage Prep",
    description: "IEMs, gear, and pre-show checklists",
    icon: Headphones,
    path: "/stage-prep",
    accentClass: "hub-accent-gear",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function Hub() {
  return (
    <div className="relative min-h-screen">
      {/* Vocal Notes Desk Background */}
      <VocalNotesDeskBackground />

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 lg:px-12 xl:px-16 pt-8 md:pt-12 lg:pt-16 pb-32 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="glass-card inline-block px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl mb-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground drop-shadow-lg">
              Vocalist Toolkit
            </h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg mt-1 md:mt-2">
              Everything you need on the road
            </p>
          </div>
        </motion.div>

        {/* Hub Cards Grid - Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 max-w-lg md:max-w-none mx-auto"
        >
          {hubModules.map((module) => (
            <motion.div key={module.id} variants={itemVariants}>
              <HubCard
                title={module.title}
                description={module.description}
                icon={module.icon}
                path={module.path}
                accentClass={module.accentClass}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
