import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import { useLocation } from "wouter";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoginPage from "@/components/LoginPage";
import OnboardingLayout from "@/components/OnboardingLayout";
import AdminPanel from "@/components/AdminPanel";
import ValidationPanel from "@/components/ValidationPanel";
import ModuleEvaluation from "@/components/ModuleEvaluation";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

function App() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleLoginSuccess = () => {
    // Sempre direcionar para onboarding após login, independente do perfil
    setLocation("/onboarding");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <Switch>
          <Route path="/" exact>
            <WelcomeScreen onStart={() => setLocation("/login")} />
          </Route>
          <Route path="/welcome" exact>
            <WelcomeScreen onStart={() => setLocation("/login")} />
          </Route>
          <Route path="/login" exact>
            <LoginPage onLogin={handleLoginSuccess} />
          </Route>
          <Route path="/onboarding">
            <OnboardingLayout onBack={() => setLocation("/welcome")} />
          </Route>
          <Route path="/modulo/:moduleId/avaliacao">
            {(params) => {
              const moduleNumber = parseInt(params.moduleId);
              return (
                <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 p-8">
                  <div className="max-w-4xl mx-auto">
                    <ModuleEvaluation
                      moduleNumber={moduleNumber}
                      onCancel={() => setLocation("/onboarding")}
                    />
                  </div>
                </div>
              );
            }}
          </Route>
          <Route path="/admin">
            <AdminPanel />
          </Route>
          <Route path="/validation">
            <ValidationPanel />
          </Route>
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;