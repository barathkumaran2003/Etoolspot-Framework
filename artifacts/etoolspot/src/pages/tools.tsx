import React, { useState } from "react";
import { PageTransition, GlassCard, NeonButton, NeonInput } from "@/components/ui/shared";
import { useTools } from "@/hooks/use-tools";
import { useCurrentUser } from "@/hooks/use-auth";
import { Search, Lock, Wrench, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Tools() {
  const { data: tools } = useTools();
  const { data: user } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  if (!tools || !user) return null;

  const categories = ["ALL", ...Array.from(new Set(tools.map(t => t.category)))];

  const filteredTools = tools.filter(t => {
    if (!t.isActive) return false;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filter === "ALL" || t.category === filter;
    return matchSearch && matchCat;
  });

  return (
    <PageTransition>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">All Tools</h1>
        <p className="text-sm text-muted-foreground">Browse and launch tools from your workspace.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-7">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <NeonInput
            placeholder="Search tools..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-muted-foreground shrink-0" />
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap text-xs font-semibold transition-all duration-150 border ${
                  filter === cat
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
      >
        {filteredTools.map(tool => {
          const isLocked = tool.isPremium && user.subscription === "FREE";

          return (
            <motion.div
              key={tool.id}
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } }}
            >
              <GlassCard className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${isLocked ? "bg-muted border-border text-muted-foreground" : "bg-primary/10 border-primary/20 text-primary"}`}>
                      <Wrench size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{tool.name}</h3>
                      <p className="text-xs text-muted-foreground">{tool.category}</p>
                    </div>
                  </div>
                  {tool.isPremium && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shrink-0">
                      PRO
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground flex-1 mb-5 leading-relaxed">{tool.description}</p>

                {isLocked ? (
                  <Link href="/subscription" className="block w-full">
                    <NeonButton variant="ghost" className="w-full text-muted-foreground">
                      <Lock size={13} /> Upgrade to unlock
                    </NeonButton>
                  </Link>
                ) : (
                  <NeonButton variant="primary" className="w-full" onClick={() => window.open(tool.url, "_blank")}>
                    Open Tool <ArrowRight size={13} />
                  </NeonButton>
                )}
              </GlassCard>
            </motion.div>
          );
        })}

        {filteredTools.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Wrench size={24} className="text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground mb-1">No tools found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter.</p>
          </div>
        )}
      </motion.div>
    </PageTransition>
  );
}
