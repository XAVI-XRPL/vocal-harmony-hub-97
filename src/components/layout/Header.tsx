import { motion } from "framer-motion";
import { Search, Menu, Bell } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RMVTLogo } from "@/components/ui/RMVTLogo";
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
      
      {/* Subtle inner glow — static for performance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.04) 0%, transparent 50%)",
        }}
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
            <RMVTLogo size="sm" animated />
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
        <div className="relative">
          <IconButton
            icon={Bell}
            variant="ghost"
            size="sm"
            label="Notifications"
          />
          {/* Notification badge — static dot */}
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-bg ring-2 ring-background" />
        </div>
      </div>
    </motion.header>
  );
}
