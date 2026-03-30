import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  FileText, QrCode, Barcode, ScanText, Package,
  Sparkles, Zap, Shield, Rocket, Star,
  LayoutDashboard, Settings, LogOut, ChevronDown,
  CheckCircle2, ArrowRight,
} from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { initTheme } from "@/hooks/use-theme";

initTheme();

const tools = [
  { name: "Resume Builder", icon: FileText, desc: "Craft stunning resumes in minutes", color: "text-blue-500 bg-blue-50 dark:bg-blue-950" },
  { name: "QR Generator", icon: QrCode, desc: "Generate QR codes instantly", color: "text-violet-500 bg-violet-50 dark:bg-violet-950" },
  { name: "Barcode Generator", icon: Barcode, desc: "Industry-standard barcodes", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950" },
  { name: "Image to Text", icon: ScanText, desc: "OCR text extraction", color: "text-amber-500 bg-amber-50 dark:bg-amber-950" },
  { name: "EXE/APK Converter", icon: Package, desc: "Cloud-based conversion", color: "text-rose-500 bg-rose-50 dark:bg-rose-950" },
];

const features = [
  { icon: Sparkles, title: "Modern Design", desc: "Clean, intuitive UI built for productivity and delight.", color: "text-violet-500 bg-violet-50 dark:bg-violet-950" },
  { icon: Zap, title: "Instant Results", desc: "All tools run client-side — zero waiting, zero uploads.", color: "text-amber-500 bg-amber-50 dark:bg-amber-950" },
  { icon: Shield, title: "100% Private", desc: "Your data stays in your browser, always.", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950" },
];

const plans = [
  {
    name: "Free", price: "$0", period: "forever",
    desc: "Get started with essential tools at no cost.",
    features: ["Resume Builder", "QR Generator", "2 exports/day"],
    highlight: false, cta: "Get Started Free",
  },
  {
    name: "Pro", price: "$9.99", period: "/month",
    desc: "Unlock advanced tools and unlimited usage.",
    features: ["All Free tools", "Barcode Generator", "Image to Text", "Unlimited exports"],
    highlight: true, cta: "Start Pro Trial",
  },
  {
    name: "Premium", price: "$19.99", period: "/month",
    desc: "The complete platform for power users.",
    features: ["All Pro tools", "EXE/APK Converter", "AI Tools", "Priority support"],
    highlight: false, cta: "Go Premium",
  },
];

const stagger = { visible: { transition: { staggerChildren: 0.09 } }, hidden: {} };
const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] orb-primary rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] orb-secondary rounded-full blur-3xl opacity-30" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-4"
        style={{ background: "hsl(var(--surface) / 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2.5">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8" />
          <span className="font-display font-bold text-lg text-primary">Etoolspot</span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-muted border border-border"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-foreground">{user.username}</span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl overflow-hidden z-50"
                    style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-soft)" }}
                  >
                    {[
                      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
                      { label: "Settings", icon: Settings, path: "/settings" },
                    ].map(item => (
                      <button
                        key={item.label}
                        onClick={() => { setDropdownOpen(false); navigate(item.path); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <item.icon size={15} className="text-muted-foreground" />
                        {item.label}
                      </button>
                    ))}
                    <div className="border-t border-border" />
                    <button
                      onClick={() => { setDropdownOpen(false); logout(undefined, { onSuccess: () => navigate("/") }); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/8 transition-colors"
                    >
                      <LogOut size={15} />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted border border-border transition-all"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="btn-primary px-5 py-2 rounded-xl text-sm font-semibold text-white"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="flex flex-col items-center text-center pt-24 pb-16 px-6 relative">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
          style={{ background: "hsl(var(--primary) / 0.08)", borderColor: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}
        >
          <Star size={12} /> Trusted by 10,000+ professionals
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl text-foreground"
        >
          Build tools{" "}
          <span style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            fluidly
          </span>{" "}with ease
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          All-in-one platform for modern developers and creators. Build, convert, generate and automate — all from one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={() => navigate("/signup")}
            className="btn-primary px-7 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
          >
            <Rocket size={16} /> Get Started Free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 rounded-xl text-sm font-semibold border border-border bg-card text-foreground hover:bg-muted transition-all flex items-center gap-2"
          >
            Explore Tools <ArrowRight size={15} />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 flex gap-12 flex-wrap justify-center"
        >
          {[["5+", "Tools Available"], ["10K+", "Active Users"], ["Free", "To Start"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-2xl font-extrabold text-foreground">{v}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{l}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── TOOLS ── */}
      <section className="py-20 px-6 md:px-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-primary mb-3">What's inside</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Powerful Tools</motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground max-w-md mx-auto">Everything you need, elegantly in one place.</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto"
        >
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.name} variants={fadeUp} whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card p-5 text-center cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{tool.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 md:px-16" style={{ background: "hsl(var(--muted) / 0.4)" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Why choose us</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-foreground">Built for everyone</motion.h2>
          </div>
          <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeUp} className="glass-card p-7 text-center">
                  <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={26} />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 px-6 md:px-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Pricing</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Simple, honest pricing</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground">Start free. Upgrade when you're ready.</motion.p>
          </div>

          <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <motion.div key={plan.name} variants={fadeUp}
                className={`glass-card p-7 flex flex-col relative ${plan.highlight ? "border-primary/40 shadow-[0_8px_32px_hsl(var(--primary)/0.15)]" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold btn-primary text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="font-bold text-muted-foreground text-sm uppercase tracking-wide mb-2">{plan.name}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 size={15} className="text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/signup")}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "btn-primary text-white"
                      : "border border-border bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto rounded-3xl p-12 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.06))", border: "1px solid hsl(var(--primary) / 0.2)" }}
        >
          <div className="absolute inset-0 orb-primary rounded-3xl blur-2xl opacity-20 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Start using Etoolspot <span style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>today</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Join thousands of users who trust Etoolspot for their daily workflow.</p>
            <button
              onClick={() => navigate("/signup")}
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white"
            >
              <Rocket size={16} /> Get Started Free
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center text-sm border-t border-border text-muted-foreground">
        <p>© 2026 Etoolspot. All rights reserved. Built with ♥ for creators.</p>
      </footer>
    </div>
  );
}
