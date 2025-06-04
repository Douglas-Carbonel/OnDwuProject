import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import OnboardingLayout from "@/components/OnboardingLayout";
import AdminPanel from "@/components/AdminPanel";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Users, LogOut } from "lucide-react";

export default function OnboardingPage() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<"onboarding" | "admin">("onboarding");

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/welcome");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return <WelcomeScreen onStart={() => setLocation("/login")} />;
  }

  // Admin can switch between views
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Admin Navigation Bar */}
        <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="text-white font-bold text-lg">Portal DWU - Admin</div>
                <div className="text-slate-400 text-sm">
                  Olá, {user?.name}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant={location === "/admin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocation("/admin")}
                  className={`${
                    location === "/admin" 
                      ? "bg-purple-600 hover:bg-purple-700" 
                      : "bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Shield size={16} className="mr-2" />
                  Administração
                </Button>

                <Button
                  variant={location === "/onboarding" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocation("/onboarding")}
                  className={`${
                    location === "/onboarding" 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Users size={16} className="mr-2" />
                  Onboarding
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="bg-transparent border-slate-600 text-slate-300 hover:bg-red-600 hover:border-red-600"
                >
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        {location === "/admin" ? <AdminPanel /> : <OnboardingLayout />}
      </div>
    );
  }

  // Regular user only sees onboarding
  return (
    <OnboardingLayout 
      onBack={() => setLocation("/welcome")}
    />
  );
}