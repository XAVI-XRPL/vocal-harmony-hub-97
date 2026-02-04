import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Mic2, Headphones, Brain, Dumbbell, RotateCcw } from "lucide-react";
import { ChecklistItem } from "@/types";
import { cn } from "@/lib/utils";

interface PreShowChecklistProps {
  items: ChecklistItem[];
}

const categoryIcons: Record<string, React.ElementType> = {
  vocal: Mic2,
  gear: Headphones,
  mental: Brain,
  physical: Dumbbell,
};

const categoryColors: Record<string, string> = {
  vocal: "text-accent-stage",
  gear: "text-blue-400",
  mental: "text-purple-400",
  physical: "text-green-400",
};

const categoryBgColors: Record<string, string> = {
  vocal: "bg-accent-stage/10",
  gear: "bg-blue-500/10",
  mental: "bg-purple-500/10",
  physical: "bg-green-500/10",
};

export function PreShowChecklist({ items }: PreShowChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetAll = () => {
    setCheckedItems(new Set());
  };

  const progress = (checkedItems.size / items.length) * 100;
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="backstage-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {checkedItems.size} of {items.length} complete
          </span>
          {checkedItems.size > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetAll}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </motion.button>
          )}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-stage to-accent-stage/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        {progress === 100 && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-accent-stage font-medium mt-2 text-center"
          >
            🎤 You're ready to perform!
          </motion.p>
        )}
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {sortedItems.map((item) => {
          const isChecked = checkedItems.has(item.id);
          const Icon = categoryIcons[item.category] || Circle;

          return (
            <motion.button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={cn(
                "w-full backstage-card rounded-xl p-4 text-left transition-all duration-300",
                isChecked && "border-accent-stage/30 bg-accent-stage/5"
              )}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="mt-0.5">
                  <AnimatePresence mode="wait">
                    {isChecked ? (
                      <motion.div
                        key="checked"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-accent-stage" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unchecked"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      isChecked ? "text-muted-foreground line-through" : "text-foreground"
                    )}>
                      {item.label}
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs transition-colors",
                    isChecked ? "text-muted-foreground/60" : "text-muted-foreground"
                  )}>
                    {item.description}
                  </p>
                </div>

                {/* Category Icon */}
                <div className={cn(
                  "p-1.5 rounded-lg",
                  categoryBgColors[item.category]
                )}>
                  <Icon className={cn("w-4 h-4", categoryColors[item.category])} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
