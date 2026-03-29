import { Link } from "wouter";
import { NeonButton, GlassCard } from "@/components/ui/shared";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070')] bg-cover bg-center opacity-[0.03] pointer-events-none mix-blend-screen" />
      
      <GlassCard className="max-w-md w-full text-center py-12 relative z-10 neon-border border-destructive/50 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
        <AlertTriangle className="w-20 h-20 text-destructive mx-auto mb-6 animate-pulse" />
        <h1 className="text-6xl font-display font-bold text-destructive mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-4">Sector Not Found</h2>
        <p className="text-muted-foreground mb-8">The requested digital coordinate does not exist in the current spatial index.</p>
        
        <Link href="/">
          <NeonButton variant="ghost" className="border-white/10">
            Return to Core Hub
          </NeonButton>
        </Link>
      </GlassCard>
    </div>
  );
}
