import React, { useState } from "react";
import { PageTransition, GlassCard, NeonButton, NeonInput } from "@/components/ui/shared";
import { useCurrentUser, useUpdateUser } from "@/hooks/use-auth";
import { useUpdateUser as useMutationUpdateUser } from "@/hooks/use-users";
import { Check, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Plan } from "@/lib/mock-api";

const PLANS = [
  { name: 'FREE', price: '0', description: 'Basic system access', features: ['Core Modules', 'Community Support', 'Standard Speed'], missing: ['Premium Modules', 'Priority Access', 'API Key'] },
  { name: 'PRO', price: '9.99', description: 'Advanced operability', features: ['Core Modules', 'Premium Modules', 'Priority Access', 'Standard Speed'], missing: ['API Key'] },
  { name: 'PREMIUM', price: '19.99', description: 'Unrestricted terminal access', features: ['Core Modules', 'Premium Modules', 'Priority Access', 'Maximum Speed', 'API Key', 'Dedicated Support'], missing: [] }
];

export default function Subscription() {
  const { data: user } = useCurrentUser();
  const { mutate: updateUser } = useMutationUpdateUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const handleUpgradeClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      updateUser({ id: user.id, updates: { subscription: selectedPlan! } });
      setIsProcessing(false);
      setIsModalOpen(false);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl text-foreground neon-text mb-4">Elevate Access Tier</h1>
        <p className="text-muted-foreground text-lg">Unlock restricted sectors and maximize your workflow potential.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = user.subscription === plan.name;
          const highlight = plan.name === 'PRO';

          return (
            <GlassCard key={plan.name} glow={highlight} className={`flex flex-col relative ${isCurrent ? 'ring-2 ring-primary border-transparent' : ''}`}>
              {isCurrent && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Active Protocol
                </div>
              )}
              
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
                <div className="mt-6 flex items-baseline justify-center gap-1">
                  <span className="text-xl text-muted-foreground">$</span>
                  <span className="text-5xl font-display font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} className="flex items-center gap-3 opacity-50">
                    <X className="w-5 h-5 text-destructive" />
                    <span className="text-sm line-through">{f}</span>
                  </div>
                ))}
              </div>

              <NeonButton 
                variant={highlight ? 'primary' : 'ghost'} 
                className={!highlight ? 'border border-white/20' : ''}
                disabled={isCurrent}
                onClick={() => handleUpgradeClick(plan.name as Plan)}
              >
                {isCurrent ? 'Active' : `Select ${plan.name}`}
              </NeonButton>
            </GlassCard>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isProcessing && setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md"
            >
              <GlassCard glow>
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-display font-bold">Secure Transaction</h2>
                </div>
                <p className="text-muted-foreground mb-6">Upgrading terminal access to <span className="text-primary font-bold">{selectedPlan}</span> tier.</p>
                
                <form onSubmit={processPayment} className="space-y-4">
                  <NeonInput label="Cardholder Alias" required placeholder="Neo" />
                  <NeonInput label="Card Sequence" required placeholder="0000 0000 0000 0000" pattern="\d{16}" title="16 digit sequence" />
                  <div className="grid grid-cols-2 gap-4">
                    <NeonInput label="Expiry (MM/YY)" required placeholder="12/99" />
                    <NeonInput label="CVC" required placeholder="•••" type="password" maxLength={4} />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <NeonButton type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)} disabled={isProcessing}>Abort</NeonButton>
                    <NeonButton type="submit" variant="primary" className="flex-1" isLoading={isProcessing}>Confirm</NeonButton>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
