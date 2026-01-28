import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Library, BarChart3, Mic2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: Library, label: "Library", path: "/library" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
  { icon: Home, label: "Home", path: "/" },
  { icon: Mic2, label: "Train", path: "/training" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "nav-glass",
        "safe-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-20 px-4">
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const isHome = item.path === "/";

          // Home button - special rounded square design
          if (isHome) {
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative",
                  "w-12 h-12 rounded-2xl",
                  "gradient-bg",
                  "flex items-center justify-center",
                  "home-button-glow"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: active ? 1.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Inner glow */}
                <motion.div
                  className="absolute inset-1 rounded-xl bg-white/10"
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />

                <Icon className="w-6 h-6 text-white relative z-10" strokeWidth={2} />
              </motion.button>
            );
          }

          // Regular nav items - icon only
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex items-center justify-center",
                "w-12 h-12 rounded-xl",
                "transition-all duration-300",
                active ? "text-primary" : "text-muted-foreground"
              )}
              whileTap={{ scale: 0.9 }}
            >
              {/* Active background glow */}
              {active && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 rounded-xl bg-primary/15"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <motion.div
                animate={{
                  scale: active ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative z-10"
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    active && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
                  )}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </motion.div>

              {/* Active indicator dot */}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
