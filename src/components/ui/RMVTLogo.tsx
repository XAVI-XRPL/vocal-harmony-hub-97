import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import rmvtLogo from "@/assets/rmvt-logo.png";

interface RMVTLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export function RMVTLogo({ size = "md", animated = true, className }: RMVTLogoProps) {
  return (
    <motion.div
      className={cn(
        sizeMap[size],
        "rounded-2xl overflow-hidden",
        "shadow-[0_0_30px_hsl(200_90%_55%/0.3)]",
        className
      )}
      animate={
        animated
          ? {
              boxShadow: [
                "0 0 20px hsl(200 90% 55% / 0.2)",
                "0 0 40px hsl(200 90% 55% / 0.4)",
                "0 0 20px hsl(200 90% 55% / 0.2)",
              ],
            }
          : undefined
      }
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img 
        src={rmvtLogo} 
        alt="RMVT" 
        className="w-full h-full object-cover" 
      />
    </motion.div>
  );
}
