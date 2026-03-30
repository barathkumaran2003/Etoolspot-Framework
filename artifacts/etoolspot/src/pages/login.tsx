import React from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useCurrentUser } from "@/hooks/use-auth";
import { NeonButton, NeonInput } from "@/components/ui/shared";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const { mutate: login, isPending, error } = useLogin();

  React.useEffect(() => {
    if (user) setLocation("/dashboard");
  }, [user, setLocation]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data, { onSuccess: () => setLocation("/dashboard") });
  };

  const handleGoogle = () => {
    login({ email: "guest" + Math.floor(Math.random() * 1000) + "@google.com", isGoogle: true }, {
      onSuccess: () => setLocation("/dashboard"),
    });
  };

  if (isAuthLoading) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.08))" }}>
        <div className="absolute inset-0 orb-primary rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="relative text-center px-12">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-foreground mb-3">Welcome to Etoolspot</h2>
          <p className="text-muted-foreground leading-relaxed max-w-sm">
            The all-in-one platform for modern developers and creators. Build, convert, generate and automate.
          </p>
          <div className="mt-10 flex flex-col gap-3 text-left max-w-xs mx-auto">
            {["Resume Builder", "QR & Barcode Generator", "Image to Text OCR", "File Converter"].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-12 h-12 mx-auto mb-3" />
            <span className="font-display font-bold text-xl text-primary">Etoolspot</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Enter your details to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
                {error.message}
              </div>
            )}

            <NeonInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <NeonInput
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <NeonButton type="submit" variant="primary" className="w-full mt-2" isLoading={isPending}>
              Sign In <ArrowRight size={15} />
            </NeonButton>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <NeonButton variant="ghost" className="w-full border border-border" onClick={handleGoogle} disabled={isPending}>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </NeonButton>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
