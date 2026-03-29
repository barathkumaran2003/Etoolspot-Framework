import React, { useState } from "react";
import { PageTransition, GlassCard, NeonButton, NeonInput } from "@/components/ui/shared";
import { useCurrentUser } from "@/hooks/use-auth";
import { useUsers, useUpdateUser } from "@/hooks/use-users";
import { useTools, useSaveTool, useDeleteTool } from "@/hooks/use-tools";
import { useSettings, useSaveSettings } from "@/hooks/use-settings";
import { type Tool } from "@/lib/mock-api";
import { ShieldAlert, Users, Wrench, Settings as SettingsIcon, Plus, Trash2, Edit } from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const { data: user } = useCurrentUser();
  const [, setLocation] = useLocation();

  if (user && user.role !== 'ADMIN') {
    setLocation('/');
    return null;
  }

  const [activeTab, setActiveTab] = useState<'OVERVIEW'|'USERS'|'TOOLS'|'SETTINGS'>('OVERVIEW');

  return (
    <PageTransition>
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-destructive/20 border border-destructive/50 rounded-xl text-destructive">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl text-foreground text-shadow-sm font-display font-bold uppercase tracking-wider text-destructive">Overwatch Console</h1>
          <p className="text-muted-foreground">Level 5 Security Clearance Active.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-white/10 scrollbar-hide">
        {[
          { id: 'OVERVIEW', label: 'Telemetry', icon: <ShieldAlert className="w-4 h-4" /> },
          { id: 'USERS', label: 'Entities', icon: <Users className="w-4 h-4" /> },
          { id: 'TOOLS', label: 'Modules', icon: <Wrench className="w-4 h-4" /> },
          { id: 'SETTINGS', label: 'Global Config', icon: <SettingsIcon className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl transition-all duration-300 font-bold uppercase tracking-wider text-sm ${activeTab === tab.id ? 'bg-white/10 text-white border-b-2 border-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'OVERVIEW' && <AdminOverview />}
        {activeTab === 'USERS' && <AdminUsers />}
        {activeTab === 'TOOLS' && <AdminTools />}
        {activeTab === 'SETTINGS' && <AdminSettings />}
      </div>
    </PageTransition>
  );
}

function AdminOverview() {
  const { data: users } = useUsers();
  const { data: tools } = useTools();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <GlassCard className="text-center">
        <h3 className="text-muted-foreground uppercase text-xs font-bold tracking-widest mb-2">Total Entities</h3>
        <p className="text-5xl font-display font-bold text-primary neon-text">{users?.length || 0}</p>
      </GlassCard>
      <GlassCard className="text-center">
        <h3 className="text-muted-foreground uppercase text-xs font-bold tracking-widest mb-2">Active Modules</h3>
        <p className="text-5xl font-display font-bold text-secondary">{tools?.length || 0}</p>
      </GlassCard>
      <GlassCard className="text-center">
        <h3 className="text-muted-foreground uppercase text-xs font-bold tracking-widest mb-2">Premium Revenue</h3>
        <p className="text-5xl font-display font-bold text-accent">--</p>
      </GlassCard>
      <GlassCard className="text-center">
        <h3 className="text-muted-foreground uppercase text-xs font-bold tracking-widest mb-2">Threat Level</h3>
        <p className="text-5xl font-display font-bold text-green-400">LOW</p>
      </GlassCard>
    </div>
  );
}

function AdminUsers() {
  const { data: users } = useUsers();
  const { mutate: updateUser } = useUpdateUser();

  if (!users) return null;

  return (
    <GlassCard className="overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-muted-foreground">
            <th className="p-4">Codename</th>
            <th className="p-4">Vector (Email)</th>
            <th className="p-4">Tier</th>
            <th className="p-4">Clearance</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {users.map(u => (
            <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold">{u.username}</td>
              <td className="p-4 text-muted-foreground">{u.email}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${u.subscription !== 'FREE' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/10 text-muted-foreground'}`}>
                  {u.subscription}
                </span>
              </td>
              <td className="p-4">
                <select 
                  className="bg-black/50 border border-white/10 rounded px-2 py-1 outline-none focus:border-primary"
                  value={u.role}
                  onChange={(e) => updateUser({ id: u.id, updates: { role: e.target.value as 'USER'|'ADMIN' }})}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td className="p-4 text-right">
                <button className="text-destructive hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4 ml-auto" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}

function AdminTools() {
  const { data: tools } = useTools();
  const { mutate: deleteTool } = useDeleteTool();
  const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end">
        <NeonButton onClick={() => setEditingTool({ isPremium: false, isActive: true, category: 'Utilities' })}>
          <Plus className="w-4 h-4" /> Deploy New Module
        </NeonButton>
      </div>

      {editingTool && (
        <ToolFormModal tool={editingTool} onClose={() => setEditingTool(null)} />
      )}

      <div className="grid grid-cols-1 gap-4">
        {tools?.map(tool => (
          <GlassCard key={tool.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-lg">{tool.name}</h3>
                {tool.isPremium && <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded border border-secondary/30 font-bold uppercase tracking-wider">PREMIUM</span>}
                <span className="text-[10px] bg-white/10 text-muted-foreground px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">{tool.category}</span>
              </div>
              <p className="text-sm text-muted-foreground">{tool.url}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingTool(tool)} className="p-2 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => deleteTool(tool.id)} className="p-2 bg-white/5 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ToolFormModal({ tool, onClose }: { tool: Partial<Tool>, onClose: () => void }) {
  const { mutate: saveTool, isPending } = useSaveTool();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    saveTool({
      id: tool.id,
      name: fd.get('name') as string,
      description: fd.get('description') as string,
      url: fd.get('url') as string,
      category: fd.get('category') as string,
      icon: 'Code', // Hardcoded icon for now
      isPremium: fd.get('isPremium') === 'true',
      isActive: true
    }, {
      onSuccess: onClose
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <GlassCard glow className="w-full max-w-lg">
        <h2 className="text-xl font-display font-bold mb-6">{tool.id ? 'Reconfigure Module' : 'Initialize New Module'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <NeonInput name="name" label="Module Designation" defaultValue={tool.name} required />
          <NeonInput name="description" label="Operational Parameters" defaultValue={tool.description} required />
          <NeonInput name="url" label="Target URL" defaultValue={tool.url} required />
          <NeonInput name="category" label="Classification" defaultValue={tool.category} required />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">Access Level</label>
            <select name="isPremium" defaultValue={tool.isPremium ? 'true' : 'false'} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-foreground">
              <option value="false">Standard (Free)</option>
              <option value="true">Restricted (Premium)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <NeonButton type="button" variant="ghost" className="flex-1" onClick={onClose}>Abort</NeonButton>
            <NeonButton type="submit" variant="primary" className="flex-1" isLoading={isPending}>Commit</NeonButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

function AdminSettings() {
  const { data: settings } = useSettings();
  const { mutate: saveSettings, isPending } = useSaveSettings();

  if (!settings) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    saveSettings({
      siteName: fd.get('siteName') as string,
      primaryColor: fd.get('primaryColor') as string,
      secondaryColor: fd.get('secondaryColor') as string,
    });
  };

  return (
    <GlassCard className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
      <h2 className="text-xl font-display font-bold mb-6">Global Interface Overrides</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <NeonInput name="siteName" label="Network Identifier" defaultValue={settings.siteName} />
        
        {/* We store HSL values but show simple text inputs for demonstration. In a real app we'd map hex to HSL or use a custom color picker. */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-muted-foreground mb-4">Color parameters must be in HSL format (e.g. "180 100% 50%")</p>
          <div className="space-y-4">
            <NeonInput name="primaryColor" label="Primary Glow (HSL)" defaultValue={settings.primaryColor} />
            <NeonInput name="secondaryColor" label="Secondary Glow (HSL)" defaultValue={settings.secondaryColor} />
          </div>
        </div>

        <div className="pt-2">
          <NeonButton type="submit" variant="primary" isLoading={isPending}>Flash Config to Global Scope</NeonButton>
        </div>
      </form>
    </GlassCard>
  );
}
