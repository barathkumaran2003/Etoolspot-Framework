import React from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignup, useCurrentUser } from "@/hooks/use-auth";
import { NeonButton, NeonInput } from "@/components/ui/shared";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const signupSchema = z.object({
  username: z.string().min(3, "At least 3 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isAuthLoading } = useCurrentUser();
  const { mutate: signup, isPending, error } = useSignup();

  React.useEffect(() => {
    if (user) setLocation("/dashboard");
  }, [user, setLocation]);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupForm) => {
    signup(data, { onSuccess: () => setLocation("/dashboard") });
  };

  if (isAuthLoading) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(135deg, hsl(var(--secondary) / 0.10), hsl(var(--primary) / 0.08))" }}>
        <div className="absolute top-0 right-0 w-80 h-80 orb-secondary rounded-full blur-3xl opacity-25 pointer-events-none" />
        <div className="relative text-center px-10">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-16 h-16 mx-auto mb-5" />
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Join Etoolspot</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">Start for free. No credit card required.</p>
          <div className="flex flex-col gap-2.5 text-left">
            {["Free plan forever", "5 powerful tools", "Upgrade anytime", "Private & secure"].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 size={15} className="text-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full max-w-sm py-8"
        >
          <div className="lg:hidden text-center mb-8">
            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-10 h-10 mx-auto mb-2" />
            <span className="font-display font-bold text-lg text-primary">Etoolspot</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
            <p className="text-sm text-muted-foreground">Get started with Etoolspot for free.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
                {error.message}
              </div>
            )}

            <NeonInput
              label="Full Name"
              placeholder="John Doe"
              {...register("username")}
              error={errors.username?.message}
            />
            <NeonInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <NeonInput
              label="Mobile Number"
              placeholder="9876543210"
              {...register("mobile")}
              error={errors.mobile?.message}
            />
            <NeonInput
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              {...register("password")}
              error={errors.password?.message}
            />
            <NeonInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <NeonButton type="submit" variant="primary" className="w-full mt-2" isLoading={isPending}>
              Create Account <ArrowRight size={15} />
            </NeonButton>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
