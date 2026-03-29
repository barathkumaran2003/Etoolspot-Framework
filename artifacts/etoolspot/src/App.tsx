import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeStorage } from "@/lib/mock-api";

import { ProtectedLayout } from "@/components/layout/AppLayout";
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

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Protected Routes Wrapper */}
      <Route path="/:rest*">
        <ProtectedLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/tools" component={Tools} />
            <Route path="/settings" component={Settings} />
            <Route path="/admin" component={Admin} />
            <Route path="/subscription" component={Subscription} />
            <Route component={NotFound} />
          </Switch>
        </ProtectedLayout>
      </Route>
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
