import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Library, BarChart3, User, Crown, ChevronLeft, ChevronRight, ListMusic, ShoppingBag, Stethoscope, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { RMVTLogo } from "@/components/ui/RMVTLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  icon: typeof Home;
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Library, label: "Library", path: "/library" },
  { icon: ListMusic, label: "Playlists", path: "/playlists" },
  { icon: BarChart3, label: "Progress", path: "/progress" },
  { icon: User, label: "Profile", path: "/profile" },
];

const toolkitItems: NavItem[] = [
  { icon: ShoppingBag, label: "Vocal Rider Store", path: "/store" },
  { icon: Stethoscope, label: "Vocal Health", path: "/vocal-health" },
  { icon: Headphones, label: "Stage Prep", path: "/stage-prep" },
];

export function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-r-0 hidden md:flex",
        "sidebar-glass"
      )}
    >
      {/* Header with Logo */}
      <SidebarHeader className="p-4">
        <motion.div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
          layout
        >
          <RMVTLogo size="md" animated />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-xl gradient-text"
            >
              RVMT
            </motion.span>
          )}
        </motion.div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-4 flex flex-col">
        {/* Main Nav */}
        <SidebarMenu className="gap-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            const button = (
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative h-11 px-3 rounded-xl transition-all duration-300",
                  "hover:bg-primary/10",
                  active && "sidebar-nav-item-active"
                )}
                isActive={active}
              >
                <motion.div
                  className="relative z-10 flex items-center gap-3"
                  whileHover={{ x: isCollapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      active
                        ? "text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]"
                        : "text-muted-foreground"
                    )}
                    strokeWidth={active ? 2.5 : 1.5}
                  />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        active ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </motion.div>

                {/* Active glow background */}
                {active && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-transparent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </SidebarMenuButton>
            );

            return (
              <SidebarMenuItem key={item.path}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  button
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Toolkit Section */}
        <div className="mt-6">
          {!isCollapsed && (
            <div className="px-3 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Toolkit
              </span>
            </div>
          )}
          {isCollapsed && <div className="sidebar-divider mx-3 my-3" />}
          <SidebarMenu className="gap-1">
            {toolkitItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              const button = (
                <SidebarMenuButton
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative h-10 px-3 rounded-xl transition-all duration-300",
                    "hover:bg-primary/10",
                    active && "sidebar-nav-item-active"
                  )}
                  isActive={active}
                >
                  <motion.div
                    className="relative z-10 flex items-center gap-3"
                    whileHover={{ x: isCollapsed ? 0 : 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-all duration-300",
                        active
                          ? "text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]"
                          : "text-muted-foreground"
                      )}
                      strokeWidth={active ? 2.5 : 1.5}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "text-sm transition-colors",
                          active ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </motion.div>
                </SidebarMenuButton>
              );

              return (
                <SidebarMenuItem key={item.path}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{button}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    button
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      {/* Footer with Pro CTA and Collapse Toggle */}
      <SidebarFooter className="p-3 space-y-3">
        {/* Pro Upgrade CTA */}
        <motion.button
          onClick={() => navigate("/subscription")}
          className={cn(
            "w-full relative overflow-hidden rounded-xl",
            "bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20",
            "border border-primary/30",
            "p-3 group",
            "hover:border-primary/50 transition-all duration-300"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div
            className={cn(
              "relative z-10 flex items-center gap-3",
              isCollapsed && "justify-center"
            )}
          >
            <Crown className="w-5 h-5 text-primary" />
            {!isCollapsed && (
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  Upgrade to Pro
                </p>
                <p className="text-xs text-muted-foreground">
                  Unlock all features
                </p>
              </div>
            )}
          </div>
        </motion.button>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "h-9 rounded-lg",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-primary/10 transition-all duration-300"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
