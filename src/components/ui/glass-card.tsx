import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "solid" | "outline";
  glow?: boolean;
  glowColor?: "primary" | "accent" | "stem-vocal" | "stem-harmony";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const glowClasses = {
  primary: "hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]",
  accent: "hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]",
  "stem-vocal": "hover:shadow-[0_0_30px_hsl(var(--stem-vocal)/0.3)]",
  "stem-harmony": "hover:shadow-[0_0_30px_hsl(var(--stem-harmony)/0.3)]",
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      variant = "default",
      glow = false,
      glowColor = "primary",
      padding = "md",
      hover = true,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      "rounded-2xl transition-all duration-300",
      paddingClasses[padding],
      hover && "cursor-pointer",
      glow && glowClasses[glowColor]
    );

    const variantClasses = {
      default: "glass-card",
      solid: "glass-card-solid",
      outline: cn(
        "bg-transparent border border-glass-border",
        "backdrop-blur-sm",
        hover && "hover:border-glass-border-hover hover:bg-glass"
      ),
    };

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
        whileTap={hover ? { scale: 0.99 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
