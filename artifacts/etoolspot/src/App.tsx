import React, { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeStorage } from "@/lib/mock-api";
import { useCurrentUser } from "@/hooks/use-auth";

import { ProtectedLayout } from "@/components/layout/AppLayout";
import LandingPage from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Tools from "@/pages/tools";
import Settings from "@/pages/settings";
import Admin from "@/pages/admin";
import Subscription from "@/pages/subscription";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Initialize mock DB
initializeStorage();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser();
  if (!user) return <Login />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* Protected routes */}
      <Route path="/dashboard" component={() => (
        <AuthGate>
          <ProtectedLayout><Dashboard /></ProtectedLayout>
        </AuthGate>
      )} />
      <Route path="/tools" component={() => (
        <AuthGate>
          <ProtectedLayout><Tools /></ProtectedLayout>
        </AuthGate>
      )} />
      <Route path="/settings" component={() => (
        <AuthGate>
          <ProtectedLayout><Settings /></ProtectedLayout>
        </AuthGate>
      )} />
      <Route path="/admin" component={() => (
        <AuthGate>
          <ProtectedLayout><Admin /></ProtectedLayout>
        </AuthGate>
      )} />
      <Route path="/subscription" component={() => (
        <AuthGate>
          <ProtectedLayout><Subscription /></ProtectedLayout>
        </AuthGate>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function GlobalSettingsApplier() {
  // Directly reads localStorage initial setting to prevent flicker, 
  // hooks handle live updates in settings page
  useEffect(() => {
    try {
      const val = localStorage.getItem('etoolspot_settings');
      if (val) {
        const settings = JSON.parse(val);
        document.documentElement.style.setProperty('--primary', settings.primaryColor);
        document.documentElement.style.setProperty('--secondary', settings.secondaryColor);
      }
    } catch(e) {}
  }, []);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GlobalSettingsApplier />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
