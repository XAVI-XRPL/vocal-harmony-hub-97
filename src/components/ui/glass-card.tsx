import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "solid" | "outline";
  glow?: boolean;
  glowColor?: "primary" | "accent" | "stem-vocal" | "stem-harmony";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  depth?: "flat" | "raised" | "floating";
  tilt?: boolean;
  shine?: boolean;
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

const depthClasses = {
  flat: "",
  raised: "glass-card-raised",
  floating: "glass-card-floating",
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
      depth = "flat",
      tilt = false,
      shine = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [tiltStyle, setTiltStyle] = React.useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = (mouseX / width - 0.5) * 2;
      const yPct = (mouseY / height - 0.5) * 2;
      setTiltStyle({
        rotateX: -yPct * 6,
        rotateY: xPct * 6,
      });
    };

    const handleMouseLeave = () => {
      setTiltStyle({ rotateX: 0, rotateY: 0 });
    };

    const baseClasses = cn(
      "rounded-2xl transition-all duration-300 relative overflow-hidden",
      paddingClasses[padding],
      hover && "cursor-pointer",
      glow && glowClasses[glowColor],
      depthClasses[depth]
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
        style={
          tilt
            ? {
                ...style,
                transformStyle: "preserve-3d" as const,
              }
            : style
        }
        animate={tilt ? tiltStyle : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={hover && !tilt ? { y: -2, scale: 1.01 } : undefined}
        whileTap={hover ? { scale: 0.99 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {shine && (
          <div className="card-shine pointer-events-none absolute inset-0 rounded-2xl" />
        )}
        {children as React.ReactNode}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
