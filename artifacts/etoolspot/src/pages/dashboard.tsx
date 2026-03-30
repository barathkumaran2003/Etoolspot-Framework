import React from "react";
import { PageTransition, GlassCard, NeonButton } from "@/components/ui/shared";
import { useCurrentUser } from "@/hooks/use-auth";
import { useTools } from "@/hooks/use-tools";
import { Wrench, Crown, TrendingUp, Lock, ArrowRight, Zap, Star } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
  hidden: {},
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Dashboard() {
  const { data: user } = useCurrentUser();
  const { data: tools } = useTools();

  if (!user || !tools) return null;

  const activeTools = tools.filter(t => t.isActive);
  const premiumTools = tools.filter(t => t.isPremium);
  const featuredTools = activeTools.slice(0, 3);
  const planColors: Record<string, string> = {
    FREE: "text-muted-foreground bg-muted",
    PRO: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
    PREMIUM: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  };

  return (
    <PageTransition>
      {/* Header */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="mb-8">
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Welcome back 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{user.username}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${planColors[user.subscription]}`}>
              {user.subscription} Plan
            </span>
            <Link href="/tools">
              <NeonButton variant="primary" className="gap-2">
                Browse Tools <ArrowRight size={15} />
              </NeonButton>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          {
            label: "Available Tools",
            value: activeTools.length,
            icon: <Wrench size={22} />,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Your Plan",
            value: user.subscription,
            icon: <Crown size={22} />,
            color: "text-amber-500",
            bg: "bg-amber-100 dark:bg-amber-950",
          },
          {
            label: "Premium Tools",
            value: premiumTools.length,
            icon: <Star size={22} />,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
        ].map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <GlassCard className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-0.5">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Featured Tools */}
      <motion.div variants={stagger} initial="hidden" animate="visible">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Zap size={18} className="text-primary" /> Featured Tools
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your most-used tools at a glance</p>
          </div>
          <Link href="/tools">
            <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {featuredTools.map((tool) => {
            const isLocked = tool.isPremium && user.subscription === "FREE";
            return (
              <motion.div key={tool.id} variants={fadeUp}>
                <GlassCard className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                      <Wrench size={18} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        {tool.category}
                      </span>
                      {tool.isPremium && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1.5">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground flex-1 mb-5 leading-relaxed">{tool.description}</p>

                  {isLocked ? (
                    <Link href="/subscription" className="block w-full">
                      <NeonButton variant="ghost" className="w-full text-muted-foreground">
                        <Lock size={14} /> Upgrade to unlock
                      </NeonButton>
                    </Link>
                  ) : (
                    <NeonButton variant="primary" className="w-full" onClick={() => window.open(tool.url, "_blank")}>
                      Open Tool <ArrowRight size={14} />
                    </NeonButton>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Upgrade banner for free users */}
      {user.subscription === "FREE" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-8 rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--secondary) / 0.10))", border: "1px solid hsl(var(--primary) / 0.2)" }}
        >
          <div className="absolute right-0 top-0 w-64 h-64 orb-primary rounded-full blur-3xl opacity-30 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1">Upgrade Available</p>
              <h3 className="text-lg font-bold text-foreground">Unlock all premium tools</h3>
              <p className="text-sm text-muted-foreground mt-1">Get access to Barcode Generator, Image to Text, and more.</p>
            </div>
            <Link href="/subscription">
              <NeonButton variant="primary" className="shrink-0">
                <TrendingUp size={15} /> Upgrade Plan
              </NeonButton>
            </Link>
          </div>
        </motion.div>
      )}
    </PageTransition>
  );
}
