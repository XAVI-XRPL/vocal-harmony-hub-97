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
        "h-14 px-4",
        "flex items-center justify-between gap-4",
        "glass-card rounded-none border-x-0 border-t-0",
        "safe-top",
        className
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-lg"
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
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={cn(
                "w-full h-10 pl-10 pr-4 rounded-xl",
                "bg-glass border border-glass-border",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                "transition-all duration-300"
              )}
            />
          </div>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-2">
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
        <IconButton
          icon={Bell}
          variant="ghost"
          size="sm"
          label="Notifications"
        />
      </div>
    </motion.header>
  );
}
