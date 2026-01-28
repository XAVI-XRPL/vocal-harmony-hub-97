import { motion } from "framer-motion";
import { Search, Menu, Bell } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  showSearch?: boolean;
  title?: string;
}

export function Header({ className, showSearch = true, title }: HeaderProps) {
  const { toggleSidebar, setSearchFocused, searchQuery, setSearchQuery } = useUIStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "sticky top-0 z-40",
        "h-16 px-4",
        "flex items-center justify-between gap-4",
        "header-glass",
        "safe-top",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Gradient border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      {/* Subtle inner glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.03) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.06) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.03) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Left section */}
      <div className="flex items-center gap-3 relative z-10">
        <IconButton
          icon={Menu}
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          label="Open menu"
          className="lg:hidden"
        />

        {title ? (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        ) : (
          <div className="flex items-center gap-2.5">
            <motion.div 
              className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 0 hsl(var(--primary) / 0)",
                  "0 0 20px hsl(var(--primary) / 0.4)",
                  "0 0 0 hsl(var(--primary) / 0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-sm">R</span>
            </motion.div>
            <span className="font-semibold text-lg gradient-text hidden sm:block">RVMT</span>
          </div>
        )}
      </div>

      {/* Center - Search (on larger screens) */}
      {showSearch && (
        <div className="hidden sm:flex flex-1 max-w-md mx-4 relative z-10">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "w-full h-10 pl-10 pr-4 rounded-xl",
                "search-glass",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                "transition-all duration-300"
              )}
            />
          </div>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-2 relative z-10">
        {showSearch && (
          <IconButton
            icon={Search}
            variant="ghost"
            size="sm"
            label="Search"
            className="sm:hidden"
          />
        )}
        <ThemeToggle />
        <motion.div className="relative">
          <IconButton
            icon={Bell}
            variant="ghost"
            size="sm"
            label="Notifications"
          />
          {/* Notification badge */}
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 rounded-full gradient-bg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </motion.header>
  );
}
