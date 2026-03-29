import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Sparkles,
  QrCode,
  FileText,
  Barcode,
  ScanText,
  Rocket,
  Package,
  Zap,
  Shield,
  Star,
  LayoutDashboard,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";

const tools = [
  { name: "Resume Builder", icon: FileText, desc: "Craft stunning resumes in minutes" },
  { name: "QR Generator", icon: QrCode, desc: "Generate QR codes for any URL" },
  { name: "Barcode Generator", icon: Barcode, desc: "Create industry-standard barcodes" },
  { name: "Image to Text", icon: ScanText, desc: "Extract text from any image via OCR" },
  { name: "EXE/APK Converter", icon: Package, desc: "Convert executables in the cloud" },
];

const features = [
  { icon: Sparkles, title: "Modern UI Experience", desc: "Glassmorphism design built for the future" },
  { icon: Zap, title: "Fast & Efficient Tools", desc: "Instant results with zero wait time" },
  { icon: Shield, title: "Secure & Private", desc: "Your data never leaves your browser" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Basic tools access",
    features: ["Resume Builder", "QR Generator", "2 exports/day"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    desc: "Advanced features unlocked",
    features: ["All Free tools", "Barcode Generator", "Image to Text", "Unlimited exports"],
    highlight: true,
  },
  {
    name: "Premium",
    price: "$19.99/mo",
    desc: "Full platform access",
    features: ["All Pro tools", "EXE/APK Converter", "AI Tools", "Priority support"],
    highlight: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { data: user } = useCurrentUser();

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "hsl(230 25% 4%)", color: "hsl(210 40% 98%)" }}>

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(180 100% 50%), transparent)" }} />
        <div className="absolute top-[20%] right-[-10%] w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(280 100% 65%), transparent)" }} />
        <div className="absolute bottom-[10%] left-[30%] w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(320 100% 60%), transparent)" }} />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4" style={{ background: "rgba(10,12,20,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8" />
          <span className="text-2xl font-bold" style={{ background: "linear-gradient(to right, hsl(180 100% 50%), hsl(280 100% 65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Etoolspot
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            /* Logged-in state: show avatar + name + go to dashboard */
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: "rgba(0,255,255,0.08)", border: "1px solid rgba(0,255,255,0.25)" }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "linear-gradient(135deg, hsl(180 100% 40%), hsl(280 100% 55%))" }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: "hsl(180 100% 70%)" }}>{user.username}</span>
              <LayoutDashboard size={16} style={{ color: "hsl(180 100% 60%)" }} />
            </button>
          ) : (
            /* Guest state: show Login + Get Started */
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 rounded-xl font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(180 100% 40%), hsl(280 100% 55%))", boxShadow: "0 0 20px hsl(180 100% 50% / 0.3)" }}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-24 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
          style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.3)", color: "hsl(180 100% 70%)" }}
        >
          <Star size={14} />
          Trusted by 10,000+ professionals
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl uppercase tracking-wide"
        >
          All Your Digital Tools{" "}
          <span style={{ background: "linear-gradient(to right, hsl(180 100% 50%), hsl(280 100% 65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            In One Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg"
          style={{ color: "hsl(215 20% 65%)" }}
        >
          Build, Convert, Generate &amp; Automate everything from a single place.
          Powerful tools designed for students, developers, and professionals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex gap-4 flex-wrap justify-center"
        >
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, hsl(180 100% 40%), hsl(280 100% 55%))", boxShadow: "0 0 30px hsl(180 100% 50% / 0.4)" }}
          >
            <Rocket size={20} />
            Get Started Free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Explore Tools →
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 flex gap-12 flex-wrap justify-center"
        >
          {[["5+", "Tools Available"], ["10K+", "Active Users"], ["Free", "To Start"]].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold" style={{ color: "hsl(180 100% 60%)" }}>{val}</p>
              <p className="text-sm mt-1" style={{ color: "hsl(215 20% 55%)" }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* TOOLS */}
      <section className="mt-32 px-8 md:px-16 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold uppercase tracking-widest mb-3">
            Powerful Tools
          </motion.h2>
          <motion.p variants={itemVariants} style={{ color: "hsl(215 20% 55%)" }}>
            Everything you need, in one place
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.name}
                variants={itemVariants}
                whileHover={{ scale: 1.06, y: -4 }}
                className="p-6 rounded-2xl text-center cursor-pointer transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(180 100% 50% / 0.5)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px hsl(180 100% 50% / 0.15)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <Icon className="mx-auto mb-4" size={36} style={{ color: "hsl(180 100% 60%)" }} />
                <h3 className="font-bold text-sm uppercase tracking-wide">{tool.name}</h3>
                <p className="text-xs mt-2" style={{ color: "hsl(215 20% 55%)" }}>{tool.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="mt-32 px-8 md:px-16 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold uppercase tracking-widest mb-3">
            Why Choose Etoolspot?
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className="p-8 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(0,255,255,0.1)", border: "1px solid rgba(0,255,255,0.3)" }}>
                  <Icon size={32} style={{ color: "hsl(180 100% 60%)" }} />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-2">{f.title}</h3>
                <p style={{ color: "hsl(215 20% 55%)" }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* PRICING */}
      <section className="mt-32 px-8 md:px-16 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold uppercase tracking-widest mb-3">
            Pricing
          </motion.h2>
          <motion.p variants={itemVariants} style={{ color: "hsl(215 20% 55%)" }}>
            Start free. Upgrade when you're ready.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className="p-8 rounded-2xl relative"
              style={{
                background: plan.highlight
                  ? "linear-gradient(135deg, rgba(0,255,255,0.08), rgba(180,0,255,0.08))"
                  : "rgba(255,255,255,0.04)",
                border: plan.highlight
                  ? "1px solid hsl(180 100% 50% / 0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: plan.highlight ? "0 0 30px hsl(180 100% 50% / 0.1)" : "none",
              }}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: "linear-gradient(to right, hsl(180 100% 40%), hsl(280 100% 55%))" }}>
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold uppercase tracking-widest">{plan.name}</h3>
              <p className="text-4xl font-bold mt-3" style={{ color: "hsl(180 100% 60%)" }}>{plan.price}</p>
              <p className="mt-2 text-sm" style={{ color: "hsl(215 20% 55%)" }}>{plan.desc}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span style={{ color: "hsl(180 100% 60%)" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/signup")}
                className="mt-8 w-full py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105"
                style={plan.highlight
                  ? { background: "linear-gradient(135deg, hsl(180 100% 40%), hsl(280 100% 55%))", boxShadow: "0 0 20px hsl(180 100% 50% / 0.3)" }
                  : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }
                }
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-32 mb-20 text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide">
            Start Using Etoolspot{" "}
            <span style={{ background: "linear-gradient(to right, hsl(180 100% 50%), hsl(280 100% 65%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Today
            </span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: "hsl(215 20% 55%)" }}>
            Join thousands of users who trust Etoolspot for their daily workflow.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-8 px-10 py-4 rounded-xl font-bold text-xl flex items-center gap-3 mx-auto transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, hsl(180 100% 40%), hsl(280 100% 55%))", boxShadow: "0 0 40px hsl(180 100% 50% / 0.4)" }}
          >
            <Rocket size={22} />
            Get Started Free
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm border-t" style={{ borderColor: "rgba(255,255,255,0.08)", color: "hsl(215 20% 45%)" }}>
        <p>© 2026 Etoolspot. All rights reserved. Built with ❤ for creators.</p>
      </footer>
    </div>
  );
}
