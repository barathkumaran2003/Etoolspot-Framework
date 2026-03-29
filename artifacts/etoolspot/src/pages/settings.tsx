import React, { useState } from "react";
import { PageTransition, GlassCard, NeonButton, NeonInput } from "@/components/ui/shared";
import { useCurrentUser, useUpdateUser } from "@/hooks/use-auth";
import { useUpdateUser as useMutationUpdateUser } from "@/hooks/use-users";
import { UserCircle, Key, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const { data: user } = useCurrentUser();
  const { mutate: updateUser, isPending } = useMutationUpdateUser();
  const [activeTab, setActiveTab] = useState('PROFILE');

  if (!user) return null;

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateUser({ id: user.id, updates: { username: fd.get('username') as string, mobile: fd.get('mobile') as string } }, {
      onSuccess: () => toast({ title: "Profile updated via secure channel." })
    });
  };

  const handleSecurityUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateUser({ id: user.id, updates: { password: fd.get('password') as string } }, {
      onSuccess: () => {
        toast({ title: "Security keys updated successfully." });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl text-foreground neon-text mb-2">System Configuration</h1>
        <p className="text-muted-foreground">Modify local user variables and interface settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('PROFILE')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'PROFILE' ? 'bg-primary/20 text-primary border border-primary/50' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
            <UserCircle className="w-5 h-5" /> Base Profile
          </button>
          <button 
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'SECURITY' ? 'bg-secondary/20 text-secondary border border-secondary/50' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
            <Key className="w-5 h-5" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('APPEARANCE')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'APPEARANCE' ? 'bg-accent/20 text-accent border border-accent/50' : 'hover:bg-white/5 text-muted-foreground'}`}
          >
            <Palette className="w-5 h-5" /> Appearance
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'PROFILE' && (
            <GlassCard glow className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-display font-bold mb-6">Base Identity Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-3xl font-display font-bold text-primary shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Avatar data pulled from initial hash.</p>
                    <NeonButton type="button" variant="ghost" className="py-2 px-4 text-xs">Update Hash</NeonButton>
                  </div>
                </div>

                <NeonInput label="Codename" name="username" defaultValue={user.username} required />
                <NeonInput label="Email Vector" defaultValue={user.email} disabled className="opacity-50" />
                <NeonInput label="Comm Link" name="mobile" defaultValue={user.mobile} required />
                
                <div className="pt-4">
                  <NeonButton type="submit" isLoading={isPending}>Commit Changes</NeonButton>
                </div>
              </form>
            </GlassCard>
          )}

          {activeTab === 'SECURITY' && (
            <GlassCard className="animate-in fade-in slide-in-from-bottom-4 duration-500 neon-border-secondary">
              <h2 className="text-2xl font-display font-bold mb-6">Cryptographic Security</h2>
              <form onSubmit={handleSecurityUpdate} className="space-y-6 max-w-md">
                <NeonInput label="Current Security Key" type="password" required placeholder="••••••••" />
                <NeonInput label="New Security Key" name="password" type="password" required placeholder="••••••••" />
                <div className="pt-4">
                  <NeonButton variant="secondary" type="submit" isLoading={isPending}>Re-Encrypt</NeonButton>
                </div>
              </form>
            </GlassCard>
          )}

          {activeTab === 'APPEARANCE' && (
            <GlassCard className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-display font-bold mb-6">Interface Visuals</h2>
              <div className="space-y-6">
                <div>
                  <p className="mb-4">Theme preset is locked to <span className="text-primary font-bold">Cyber Neon</span> protocol. Further customizations are handled via Admin Panel global overrides.</p>
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                    <span>Holographic Mode</span>
                    <div className="w-12 h-6 bg-primary/20 rounded-full border border-primary relative flex items-center px-1">
                      <div className="w-4 h-4 rounded-full bg-primary absolute right-1 shadow-[0_0_10px_#0ff]" />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
