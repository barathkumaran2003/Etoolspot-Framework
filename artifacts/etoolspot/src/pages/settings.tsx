import React, { useState } from "react";
import { PageTransition, GlassCard, NeonButton, NeonInput } from "@/components/ui/shared";
import { useCurrentUser } from "@/hooks/use-auth";
import { useUpdateUser as useMutationUpdateUser } from "@/hooks/use-users";
import { useTheme } from "@/hooks/use-theme";
import { UserCircle, KeyRound, Palette, Sun, Moon, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const tabs = [
  { id: "PROFILE", label: "Profile", icon: UserCircle },
  { id: "SECURITY", label: "Security", icon: KeyRound },
  { id: "APPEARANCE", label: "Appearance", icon: Palette },
];

export default function Settings() {
  const { data: user } = useCurrentUser();
  const { mutate: updateUser, isPending } = useMutationUpdateUser();
  const [activeTab, setActiveTab] = useState("PROFILE");
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateUser(
      { id: user.id, updates: { username: fd.get("username") as string, mobile: fd.get("mobile") as string } },
      { onSuccess: () => toast({ title: "Profile updated successfully." }) }
    );
  };

  const handleSecurityUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateUser(
      { id: user.id, updates: { password: fd.get("password") as string } },
      {
        onSuccess: () => {
          toast({ title: "Password changed successfully." });
          (e.target as HTMLFormElement).reset();
        },
      }
    );
  };

  return (
    <PageTransition>
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab nav */}
        <div className="w-full md:w-52 shrink-0">
          <div className="flex md:flex-col gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  {tab.label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "PROFILE" && (
              <GlassCard>
                <h2 className="text-lg font-bold text-foreground mb-6">Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-5 max-w-md">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {user.subscription}
                      </span>
                    </div>
                  </div>

                  <NeonInput label="Display Name" name="username" defaultValue={user.username} required />
                  <NeonInput label="Email" defaultValue={user.email} disabled className="opacity-60" />
                  <NeonInput label="Mobile" name="mobile" defaultValue={user.mobile} required />

                  <div className="pt-2">
                    <NeonButton type="submit" variant="primary" isLoading={isPending}>
                      <Check size={15} /> Save Changes
                    </NeonButton>
                  </div>
                </form>
              </GlassCard>
            )}

            {activeTab === "SECURITY" && (
              <GlassCard>
                <h2 className="text-lg font-bold text-foreground mb-2">Change Password</h2>
                <p className="text-sm text-muted-foreground mb-6">Update your account password to keep your account secure.</p>
                <form onSubmit={handleSecurityUpdate} className="space-y-5 max-w-md">
                  <NeonInput label="Current Password" type="password" required placeholder="••••••••" />
                  <NeonInput label="New Password" name="password" type="password" required placeholder="••••••••" minLength={6} />
                  <div className="pt-2">
                    <NeonButton type="submit" variant="primary" isLoading={isPending}>
                      <Check size={15} /> Update Password
                    </NeonButton>
                  </div>
                </form>
              </GlassCard>
            )}

            {activeTab === "APPEARANCE" && (
              <GlassCard>
                <h2 className="text-lg font-bold text-foreground mb-2">Appearance</h2>
                <p className="text-sm text-muted-foreground mb-6">Customize how Etoolspot looks on your device.</p>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Theme</p>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <button
                      onClick={() => { if (theme !== "light") toggleTheme(); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                        theme === "light"
                          ? "border-primary bg-primary/8"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <Sun size={22} className={theme === "light" ? "text-primary" : "text-muted-foreground"} />
                      <span className={`text-sm font-semibold ${theme === "light" ? "text-primary" : "text-muted-foreground"}`}>Light</span>
                      {theme === "light" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Active</span>
                      )}
                    </button>
                    <button
                      onClick={() => { if (theme !== "dark") toggleTheme(); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                        theme === "dark"
                          ? "border-primary bg-primary/8"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <Moon size={22} className={theme === "dark" ? "text-primary" : "text-muted-foreground"} />
                      <span className={`text-sm font-semibold ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`}>Dark</span>
                      {theme === "dark" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">Active</span>
                      )}
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
