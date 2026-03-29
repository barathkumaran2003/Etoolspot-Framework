import React, { useState } from "react";
import { PageTransition, GlassCard, NeonButton, NeonInput } from "@/components/ui/shared";
import { useTools } from "@/hooks/use-tools";
import { useCurrentUser } from "@/hooks/use-auth";
import { Search, Lock, Code2 } from "lucide-react";
import { Link } from "wouter";

export default function Tools() {
  const { data: tools } = useTools();
  const { data: user } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  if (!tools || !user) return null;

  const categories = ["ALL", ...Array.from(new Set(tools.map(t => t.category)))];

  const filteredTools = tools.filter(t => {
    if (!t.isActive) return false;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || t.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl text-foreground neon-text mb-2">Module Repository</h1>
        <p className="text-muted-foreground">Access all available system extensions.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <NeonInput 
            placeholder="Search modules..." 
            className="pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                filter === cat 
                  ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(0,255,255,0.3)]" 
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const isLocked = tool.isPremium && user.subscription === 'FREE';

          return (
            <GlassCard key={tool.id} glow={!isLocked} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border transition-colors ${isLocked ? 'bg-black/50 border-white/10 text-muted-foreground' : 'bg-primary/10 border-primary/30 text-primary'}`}>
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{tool.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{tool.category}</span>
                  </div>
                </div>
                {tool.isPremium && <span className="px-2 py-1 bg-secondary/20 text-secondary text-[10px] font-bold rounded border border-secondary/30">PRO</span>}
              </div>
              
              <p className="text-muted-foreground text-sm flex-1 mb-6">{tool.description}</p>
              
              {isLocked ? (
                <Link href="/subscription" className="block w-full">
                  <NeonButton variant="ghost" className="w-full bg-black/50 border-white/10 text-muted-foreground hover:text-white">
                    <Lock className="w-4 h-4 mr-2" /> Upgrade to Access
                  </NeonButton>
                </Link>
              ) : (
                <NeonButton variant="secondary" className="w-full" onClick={() => window.open(tool.url, "_blank")}>
                  Initialize
                </NeonButton>
              )}
            </GlassCard>
          );
        })}

        {filteredTools.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <Code2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No modules found matching current parameters.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
