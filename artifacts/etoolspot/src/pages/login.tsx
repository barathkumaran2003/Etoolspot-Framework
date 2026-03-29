import React from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useCurrentUser } from "@/hooks/use-auth";
import { GlassCard, NeonButton, NeonInput } from "@/components/ui/shared";
import { motion } from "framer-motion";

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
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: () => setLocation("/dashboard")
    });
  };

  const handleGoogleLogin = () => {
    login({ email: "guest" + Math.floor(Math.random()*1000) + "@google.com", isGoogle: true }, {
      onSuccess: () => setLocation("/dashboard")
    });
  };

  if (isAuthLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 overflow-hidden">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt="Background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Initialize your workspace protocol</p>
        </div>

        <GlassCard glow>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm text-center">
                {error.message}
              </div>
            )}
            
            <NeonInput 
              label="Email Sequence" 
              type="email" 
              placeholder="user@network.net" 
              {...register("email")}
              error={errors.email?.message}
            />
            
            <NeonInput 
              label="Access Code" 
              type="password" 
              placeholder="••••••••" 
              {...register("password")}
              error={errors.password?.message}
            />

            <NeonButton type="submit" className="w-full mt-6" isLoading={isPending}>
              Authenticate
            </NeonButton>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">External Link</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <NeonButton variant="ghost" className="w-full border-white/10" onClick={handleGoogleLogin} disabled={isPending}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google Simulation
          </NeonButton>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Unregistered entity? <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors">Establish link</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
