import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { NeonButton } from "@/components/ui/shared";
import { LayoutDashboard, Wrench, Settings, ShieldAlert, CreditCard, LogOut, Menu, X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel z-50">
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8" />
          <span className="font-display font-bold text-lg text-primary">Etoolspot</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={cn(
              "fixed md:static inset-y-0 left-0 w-64 glass-panel z-40 flex flex-col transition-transform duration-300",
              !sidebarOpen && "max-md:-translate-x-full"
            )}
          >
            <div className="p-6 hidden md:flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-10 h-10" />
              <span className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Etoolspot
              </span>
            </div>

            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <NavLink href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" onClick={() => setSidebarOpen(false)} />
              <NavLink href="/tools" icon={<Wrench />} label="All Tools" onClick={() => setSidebarOpen(false)} />
              <NavLink href="/subscription" icon={<CreditCard />} label="Subscription" onClick={() => setSidebarOpen(false)} />
              <NavLink href="/settings" icon={<Settings />} label="Settings" onClick={() => setSidebarOpen(false)} />
              
              {user.role === 'ADMIN' && (
                <>
                  <div className="my-4 border-t border-white/10" />
                  <NavLink href="/admin" icon={<ShieldAlert />} label="Admin Panel" onClick={() => setSidebarOpen(false)} className="text-secondary hover:bg-secondary/10" />
                </>
              )}
            </div>

            <div className="p-4 mt-auto border-t border-white/10">
              <div className="flex items-center gap-3 px-2 py-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  <p className="text-xs text-primary truncate font-bold">{user.subscription} PLAN</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070')] bg-cover bg-center opacity-5 pointer-events-none mix-blend-screen" />
        
        {/* Top Navbar Desktop */}
        <header className="hidden md:flex items-center justify-end px-8 py-4 glass-panel sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button className="relative text-muted-foreground hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
            </button>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-sm text-muted-foreground">Status: <span className="text-primary font-bold ml-1 tracking-widest">ONLINE</span></span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10">
          {children}
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function NavLink({ href, icon, label, className, onClick }: { href: string, icon: React.ReactNode, label: string, className?: string, onClick?: () => void }) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href} onClick={onClick}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer",
        isActive ? "bg-primary/20 text-primary font-medium neon-border" : "text-muted-foreground hover:text-foreground hover:bg-white/5",
        className
      )}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        <span>{label}</span>
      </div>
    </Link>
  );
}

function LogoutButton() {
  const { mutate, isPending } = useLogout();
  return (
    <button 
      onClick={() => mutate()}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>{isPending ? "Logging out..." : "Log Out"}</span>
    </button>
  );
}
