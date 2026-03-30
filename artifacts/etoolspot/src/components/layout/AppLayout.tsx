import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import {
  LayoutDashboard, Wrench, Settings, ShieldAlert, CreditCard,
  LogOut, Menu, X, Home, Sun, Moon, ChevronLeft, ChevronRight, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_NAMES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tools": "All Tools",
  "/settings": "Settings",
  "/subscription": "Subscription",
  "/admin": "Admin Panel",
};

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const pageName = PAGE_NAMES[location] || "Etoolspot";

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">

      {/* ── Sidebar ── */}
      <AnimatePresence initial={false}>
        <motion.aside
          key="sidebar"
          animate={{ width: collapsed ? 72 : 240 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="hidden md:flex flex-col glass-panel shrink-0 h-screen sticky top-0 z-40 overflow-hidden"
        >
          {/* Logo */}
          <div className={cn("flex items-center gap-3 px-5 py-5 border-b border-border/60", collapsed && "justify-center px-0")}>
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8 shrink-0" />
            {!collapsed && (
              <span className="font-display font-bold text-lg text-primary truncate">Etoolspot</span>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
            <SideLink href="/" icon={<Home />} label="Home" collapsed={collapsed} />
            <div className="my-2 border-t border-border/60" />
            <SideLink href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" collapsed={collapsed} />
            <SideLink href="/tools" icon={<Wrench />} label="All Tools" collapsed={collapsed} />
            <SideLink href="/subscription" icon={<CreditCard />} label="Subscription" collapsed={collapsed} />
            <SideLink href="/settings" icon={<Settings />} label="Settings" collapsed={collapsed} />
            {user.role === "ADMIN" && (
              <>
                <div className="my-2 border-t border-border/60" />
                <SideLink href="/admin" icon={<ShieldAlert />} label="Admin Panel" collapsed={collapsed} accent />
              </>
            )}
          </nav>

          {/* User + logout */}
          <div className="border-t border-border/60 p-3 space-y-2">
            {!collapsed && (
              <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-muted/60">
                <Avatar name={user.username} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.username}</p>
                  <p className="text-xs text-primary font-medium">{user.subscription}</p>
                </div>
              </div>
            )}
            <LogoutBtn collapsed={collapsed} />
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(p => !p)}
            className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-50"
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </motion.aside>
      </AnimatePresence>

      {/* ── Mobile sidebar ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 glass-panel z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-7 h-7" />
                  <span className="font-display font-bold text-primary">Etoolspot</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <SideLink href="/" icon={<Home />} label="Home" onClick={() => setMobileOpen(false)} />
                <div className="my-2 border-t border-border/60" />
                <SideLink href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" onClick={() => setMobileOpen(false)} />
                <SideLink href="/tools" icon={<Wrench />} label="All Tools" onClick={() => setMobileOpen(false)} />
                <SideLink href="/subscription" icon={<CreditCard />} label="Subscription" onClick={() => setMobileOpen(false)} />
                <SideLink href="/settings" icon={<Settings />} label="Settings" onClick={() => setMobileOpen(false)} />
                {user.role === "ADMIN" && (
                  <>
                    <div className="my-2 border-t border-border/60" />
                    <SideLink href="/admin" icon={<ShieldAlert />} label="Admin Panel" accent onClick={() => setMobileOpen(false)} />
                  </>
                )}
              </nav>
              <div className="border-t border-border/60 p-3">
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-muted/60 mb-2">
                  <Avatar name={user.username} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.username}</p>
                    <p className="text-xs text-primary font-medium">{user.subscription}</p>
                  </div>
                </div>
                <LogoutBtn />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-semibold text-foreground">{pageName}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification bell */}
            <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>

            {/* Avatar */}
            <Avatar name={user.username} className="cursor-pointer" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn(
      "w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shrink-0",
      className
    )}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function SideLink({
  href, icon, label, collapsed, accent, onClick
}: {
  href: string; icon: React.ReactNode; label: string;
  collapsed?: boolean; accent?: boolean; onClick?: () => void;
}) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href} onClick={onClick}>
      <div className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer group",
        isActive
          ? "bg-primary/10 text-primary"
          : accent
          ? "text-secondary hover:bg-secondary/10 hover:text-secondary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-0"
      )}>
        <span className={cn(
          "w-5 h-5 shrink-0",
          isActive ? "text-primary" : accent ? "text-secondary" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {React.cloneElement(icon as React.ReactElement, { size: 18 })}
        </span>
        {!collapsed && <span className="truncate">{label}</span>}
        {isActive && !collapsed && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        )}
      </div>
    </Link>
  );
}

function LogoutBtn({ collapsed }: { collapsed?: boolean }) {
  const { mutate, isPending } = useLogout();
  const [, navigate] = useLocation();
  return (
    <button
      onClick={() => mutate(undefined, { onSuccess: () => navigate("/") })}
      disabled={isPending}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-150",
        collapsed && "justify-center px-0"
      )}
    >
      <LogOut size={16} className="shrink-0" />
      {!collapsed && <span>{isPending ? "Logging out..." : "Log Out"}</span>}
    </button>
  );
}
