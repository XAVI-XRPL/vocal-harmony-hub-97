import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

interface DressingRoomHeroProps {
  featuredCount: number;
}

export function DressingRoomHero({ featuredCount }: DressingRoomHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative px-4 py-8 overflow-hidden"
    >
      {/* Vanity Mirror Illustration */}
      <div className="relative max-w-sm mx-auto">
        {/* Mirror Frame */}
        <div className="relative dressing-room-card rounded-3xl p-6 border-2 border-accent-store/30">
          {/* Light Bulbs */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-accent-store/80"
                style={{
                  boxShadow: "0 0 12px hsl(var(--accent-store) / 0.5)",
                }}
              />
            ))}
          </div>

          {/* Mirror Content */}
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-accent-store/20 border border-accent-store/30"
            >
              <Sparkles className="w-4 h-4 text-accent-store" />
              <span className="text-sm font-medium text-accent-store">Kimad Essentials</span>
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Vocal Rider Store
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Curated products trusted by touring professionals
            </p>

            {/* Featured Badge */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-store/10 border border-accent-store/20"
            >
              <Star className="w-4 h-4 text-accent-store fill-accent-store" />
              <span className="text-sm text-foreground">
                <span className="font-semibold text-accent-store">{featuredCount}</span> Featured Picks
              </span>
            </motion.div>
          </div>

          {/* Side Light Strips */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-accent-store/30 to-transparent rounded-full" />
          <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-accent-store/30 to-transparent rounded-full" />
        </div>

        {/* Reflection Glow */}
        <div className="absolute inset-x-8 -bottom-4 h-8 bg-accent-store/10 blur-2xl rounded-full" />
      </div>
    </motion.section>
  );
}
