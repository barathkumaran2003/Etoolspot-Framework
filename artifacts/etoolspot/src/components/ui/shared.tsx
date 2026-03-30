import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function GlassCard({ children, className, glow = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }) {
  return (
    <div
      className={cn("glass-card p-6 relative overflow-hidden", className)}
      {...props}
    >
      {glow && (
        <div className="absolute -top-16 -right-16 w-40 h-40 orb-primary rounded-full blur-2xl pointer-events-none opacity-60" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export function NeonButton({ children, className, variant = 'primary', isLoading, disabled, ...props }: NeonButtonProps) {
  const base = "relative px-5 py-2.5 font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap";

  const variants = {
    primary: "btn-primary text-white",
    secondary: "bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20",
    danger: "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent",
  };

  return (
    <button
      className={cn(base, variants[variant], (disabled || isLoading) && "opacity-50 cursor-not-allowed", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function NeonInput({ className, label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-foreground/80 ml-0.5">{label}</label>}
      <input
        className={cn(
          "saas-input w-full px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm",
          error && "border-destructive",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-destructive ml-0.5">{error}</span>}
    </div>
  );
}

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("w-full max-w-7xl mx-auto", className)}
    >
      {children}
    </motion.div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
      <p className="text-sm font-medium text-muted-foreground">Loading...</p>
    </div>
  );
}
