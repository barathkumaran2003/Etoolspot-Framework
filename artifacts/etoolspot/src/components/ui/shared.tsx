import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function GlassCard({ children, className, glow = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }) {
  return (
    <div 
      className={cn(
        "glass-card p-6 relative overflow-hidden", 
        glow && "neon-border",
        className
      )} 
      {...props}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export function NeonButton({ children, className, variant = 'primary', isLoading, disabled, ...props }: NeonButtonProps) {
  const baseStyles = "relative px-6 py-3 font-display font-bold tracking-wide uppercase rounded-xl transition-all duration-300 overflow-hidden group flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary/20 text-primary hover:bg-primary/30 neon-border",
    secondary: "bg-secondary/20 text-secondary hover:bg-secondary/30 neon-border-secondary",
    danger: "bg-destructive/20 text-destructive border border-destructive/50 hover:bg-destructive/30",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], disabled && "opacity-50 cursor-not-allowed", className)} 
      disabled={disabled || isLoading}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function NeonInput({ className, label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-muted-foreground ml-1">{label}</label>}
      <input
        className={cn(
          "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50",
          "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300",
          error && "border-destructive focus:border-destructive focus:ring-destructive/50",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-destructive ml-1">{error}</span>}
    </div>
  );
}

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-7xl mx-auto space-y-8", className)}
    >
      {children}
    </motion.div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{ animationDuration: '1s' }} />
        <div className="absolute inset-2 rounded-full border-r-2 border-secondary animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full border-b-2 border-accent animate-spin" style={{ animationDuration: '2s' }} />
        <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Loading" className="w-10 h-10 animate-pulse" />
      </div>
      <p className="mt-6 font-display font-bold text-primary tracking-[0.2em] animate-pulse">SYSTEM BOOTING...</p>
    </div>
  );
}
