import React from "react";
import { PageTransition, GlassCard, NeonButton } from "@/components/ui/shared";
import { useCurrentUser } from "@/hooks/use-auth";
import { useTools } from "@/hooks/use-tools";
import { Activity, Cpu, Shield, Zap, Lock } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: user } = useCurrentUser();
  const { data: tools } = useTools();

  if (!user || !tools) return null;

  const activeTools = tools.filter(t => t.isActive);
  const featuredTools = activeTools.slice(0, 3);

  return (
    <PageTransition>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl text-foreground neon-text mb-2">System Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, operative <span className="text-primary font-bold">{user.username}</span>.</p>
        </div>
        <Link href="/tools">
          <NeonButton variant="secondary" className="whitespace-nowrap">Access Terminal</NeonButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 rounded-xl text-primary"><Cpu size={32} /></div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Active Tools</p>
            <p className="text-3xl font-display font-bold">{activeTools.length}</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-secondary/20 rounded-xl text-secondary"><Shield size={32} /></div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Current Tier</p>
            <p className="text-2xl font-display font-bold text-secondary">{user.subscription}</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="p-4 bg-accent/20 rounded-xl text-accent"><Activity size={32} /></div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest">System Status</p>
            <p className="text-2xl font-display font-bold text-accent">OPTIMAL</p>
          </div>
        </GlassCard>
      </div>

      <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
        <Zap className="text-primary" /> Highlighted Modules
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredTools.map((tool) => {
          const isLocked = tool.isPremium && user.subscription === 'FREE';
          
          return (
            <GlassCard key={tool.id} glow={!isLocked} className="flex flex-col group h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-primary/20 transition-colors">
                  <Cpu className="text-primary w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white/5 rounded-full border border-white/10">
                  {tool.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-6">{tool.description}</p>
              
              {isLocked ? (
                <Link href="/subscription" className="block w-full">
                  <NeonButton variant="ghost" className="w-full bg-black/50 border-white/10 text-muted-foreground hover:text-white">
                    <Lock className="w-4 h-4 mr-2" /> Premium Lock
                  </NeonButton>
                </Link>
              ) : (
                <NeonButton variant="primary" className="w-full" onClick={() => window.open(tool.url, "_blank")}>
                  Execute Module
                </NeonButton>
              )}
            </GlassCard>
          );
        })}
      </div>
    </PageTransition>
  );
}
