import React from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignup, useCurrentUser } from "@/hooks/use-auth";
import { GlassCard, NeonButton, NeonInput } from "@/components/ui/shared";
import { motion } from "framer-motion";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const { mutate: signup, isPending, error } = useSignup();

  React.useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = (data: SignupForm) => {
    signup(data, {
      onSuccess: () => setLocation("/")
    });
  };

  if (isAuthLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 overflow-hidden py-12">
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
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">New Identity</h1>
          <p className="text-muted-foreground mt-2">Register your credentials</p>
        </div>

        <GlassCard glow>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm text-center">
                {error.message}
              </div>
            )}
            
            <NeonInput 
              label="Codename (Username)" 
              placeholder="neo_hacker" 
              {...register("username")}
              error={errors.username?.message}
            />

            <NeonInput 
              label="Email Vector" 
              type="email" 
              placeholder="neo@matrix.net" 
              {...register("email")}
              error={errors.email?.message}
            />

            <NeonInput 
              label="Comm Link (Mobile)" 
              placeholder="9876543210" 
              {...register("mobile")}
              error={errors.mobile?.message}
            />
            
            <NeonInput 
              label="Security Key" 
              type="password" 
              placeholder="••••••••" 
              {...register("password")}
              error={errors.password?.message}
            />

            <NeonInput 
              label="Confirm Security Key" 
              type="password" 
              placeholder="••••••••" 
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <NeonButton type="submit" className="w-full mt-6" isLoading={isPending}>
              Initialize Protocol
            </NeonButton>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already verified? <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">Login Sequence</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
