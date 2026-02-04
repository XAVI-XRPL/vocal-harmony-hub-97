import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function DemoModeBanner() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-primary/15 border-b border-primary/20 backdrop-blur-sm px-4 py-2"
    >
      <div className="flex items-center justify-center gap-2 text-sm">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">Exploring in demo mode</span>
        <span className="text-muted-foreground">•</span>
        <button
          onClick={() => navigate("/auth")}
          className="text-primary font-medium hover:underline underline-offset-2 transition-colors"
        >
          Create account to save progress
        </button>
      </div>
    </motion.div>
  );
}
