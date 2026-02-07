import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Library, BarChart3, Mic, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: Library, label: "Library", path: "/library" },
  { icon: ListMusic, label: "Playlists", path: "/playlists" },
  { icon: Home, label: "Home", path: "/" },
  { icon: Mic, label: "Hub", path: "/hub" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
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
      <div className="flex items-center justify-around h-[72px] px-4 pb-1">
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
                  "w-11 h-11 rounded-2xl",
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
                {/* Inner glow — static for perf */}
                <div className="absolute inset-1 rounded-xl bg-white/10 pointer-events-none" />

                <Icon className="w-5 h-5 text-white relative z-10" strokeWidth={2} />
              </motion.button>
            );
          }

          // Regular nav items - icon + label
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5",
                "w-14 h-14 rounded-xl",
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
                  scale: active ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative z-10"
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    active && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
                  )}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </motion.div>

              {/* Label */}
              <span className={cn(
                "text-2xs font-medium relative z-10 transition-colors duration-300",
                active ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
