import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "solid" | "accent";
  active?: boolean;
  activeColor?: string;
  label?: string;
}

const sizeClasses = {
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-14 h-14",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon: Icon,
      size = "md",
      variant = "default",
      active = false,
      activeColor,
      label,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-xl",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "touch-target",
      sizeClasses[size]
    );

    const variantClasses = {
      default: cn(
        "bg-glass border border-glass-border",
        "text-muted-foreground",
        "hover:bg-glass-hover hover:border-glass-border-hover hover:text-foreground",
        active && "bg-glass-active border-glass-border-hover text-foreground"
      ),
      ghost: cn(
        "bg-transparent text-muted-foreground",
        "hover:bg-glass hover:text-foreground",
        active && "text-foreground"
      ),
      solid: cn(
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/80",
        active && "bg-primary text-primary-foreground"
      ),
      accent: cn(
        "bg-glass border border-glass-border",
        "text-muted-foreground",
        "hover:bg-glass-hover hover:border-glass-border-hover",
        active && "border-primary/50 bg-primary/20 text-primary"
      ),
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        aria-label={label}
        {...props}
      >
        <Icon
          className={cn(
            iconSizes[size],
            active && activeColor
          )}
          strokeWidth={1.5}
        />
      </motion.button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
