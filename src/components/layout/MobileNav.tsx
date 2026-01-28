import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Library, Mic2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Library, label: "Library", path: "/library" },
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
        "glass-card rounded-none border-x-0 border-b-0",
        "safe-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1",
                "w-16 h-14 rounded-xl",
                "transition-all duration-300",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              whileTap={{ scale: 0.9 }}
            >
              {/* Active background glow */}
              {active && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 rounded-xl bg-primary/10"
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
                    "w-6 h-6 transition-all duration-300",
                    active && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
                  )}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </motion.div>
              <span
                className={cn(
                  "relative z-10 text-2xs font-medium transition-all duration-300",
                  active && "text-primary font-semibold"
                )}
              >
                {item.label}
              </span>

              {/* Active indicator dot */}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
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
