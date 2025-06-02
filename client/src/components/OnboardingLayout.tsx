import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building, UserCircle, ChevronLeft, ChevronRight, CheckCircle, LogOut, Shield } from "lucide-react";
import ModuleContent from "./ModuleContent";
import DayCompletionModal from "./DayCompletionModal";
import { useProgress } from "@/hooks/useProgress";
import { onboardingData } from "@/lib/onboarding-data";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface OnboardingLayoutProps {
  onBack: () => void;
  onGoToAdmin?: () => void;
}

export default function OnboardingLayout({ onGoToAdmin, onBack }: OnboardingLayoutProps) {
  const { progress, updateProgress, loading } = useProgress();
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationModule, setEvaluationModule] = useState<number | null>(null);
  const [pendingCompletionDay, setPendingCompletionDay] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Update local state when progress changes
  useEffect(() => {
    if (progress && Object.keys(progress).length > 0) {
      setCompletedDays(progress.completedModules || []);

      // Use currentModule from database as the source of truth
      const targetModule = progress.currentModule || 1;

      console.log(`🎯 Módulos desbloqueados: 1 até ${targetModule}`);

      if (currentDay !== targetModule) {
        setCurrentDay(targetModule);
      }
    }
  }, [progress, currentDay]);
  const { logout, isAdmin } = useAuth();
  const [location, setLocation] = useLocation();

  // Enhanced progress calculation that respects completed status
  const calculateOverallProgress = () => {
    if (!progress) return 0;
    const completedModules = progress.completedModules || [];
    return (completedModules.length / 4) * 100;
  };

  const overallProgress = calculateOverallProgress();

  // Determine completed days based on progress data - priorizar dados do banco
  const moduleProgress = progress?.moduleProgress || progress?.dayProgress || {};

  console.log("📊 Estado atual do progresso no banco:", {
    completedModules: progress?.completedModules || [],
    moduleProgress: progress?.moduleProgress || {},
    currentModule: progress?.currentModule || 1,
    moduleEvaluations: progress?.moduleEvaluations || {}
  });


  // Check if user wants to complete current day
  const handleDayCompletion = useCallback((day: number) => {
    if (!completedDays.includes(day)) {
      setPendingCompletionDay(day);
      setShowCompletionModal(true);
    }
  }, [completedDays]);

  // Confirm day completion - start evaluation
  const confirmDayCompletion = useCallback(() => {
    if (pendingCompletionDay) {
      setShowCompletionModal(false);
      setEvaluationModule(pendingCompletionDay);
      setShowEvaluation(true);
    }
  }, [pendingCompletionDay]);

  // Cancel day completion
  const cancelDayCompletion = useCallback(() => {
    setShowCompletionModal(false);
    setPendingCompletionDay(null);
  }, []);

  // Handle evaluation completion
  const handleEvaluationComplete = useCallback((passed: boolean, score: number) => {
    console.log(`🎯 Avaliação completa - Módulo: ${evaluationModule}, Passou: ${passed}, Score: ${score}`);
    setShowEvaluation(false);

    if (passed && evaluationModule && !completedDays.includes(evaluationModule)) {
      // Mark module as completed
      const newCompletedDays = [...completedDays, evaluationModule].sort((a, b) => a - b);
      const nextModule = evaluationModule < 4 ? evaluationModule + 1 : evaluationModule;

      console.log(`✅ Módulo ${evaluationModule} completado! Próximo módulo: ${nextModule}`);
      console.log(`📊 Novos módulos completados:`, newCompletedDays);

      // Update progress with completed module and next available module
      updateProgress({
        completedDays: newCompletedDays,
        dayProgress: { ...progress?.dayProgress, [evaluationModule]: 100 },
        quizResults: { ...progress?.quizResults, [evaluationModule]: { score, passed } },
        currentModule: nextModule,
        currentDay: nextModule
      });

      // Update local state immediately
      setCompletedDays(newCompletedDays);

      // Move to next module if not the last one
      if (evaluationModule < 4) {
        setCurrentDay(nextModule);
        console.log(`🚀 Movendo para o módulo ${nextModule}`);
      }
    } else if (!passed) {
      console.log(`❌ Avaliação reprovada no módulo ${evaluationModule}. Usuário deve revisar o conteúdo.`);
    }

    setEvaluationModule(null);
    setPendingCompletionDay(null);
  }, [evaluationModule, completedDays, updateProgress, progress?.dayProgress, progress?.quizResults]);

  // Cancel evaluation
  const handleCancelEvaluation = useCallback(() => {
    setShowEvaluation(false);
    setEvaluationModule(null);
    setPendingCompletionDay(null);
  }, []);

  const switchDay = (day: number) => {
    const currentModuleFromDB = progress?.currentModule || 1;
    const canAccess = day <= currentModuleFromDB;

    console.log(`🎯 Acesso ao módulo ${day}: currentModule=${currentModuleFromDB}, canAccess=${canAccess}`);

    if (canAccess) {
      setCurrentDay(day);
    }
  };

  const nextDay = () => {
    if (currentDay < 4) {
      switchDay(currentDay + 1);
    }
  };

  const previousDay = () => {
    if (currentDay > 1) {
      switchDay(currentDay - 1);
    }
  };

  const getDayIcon = (day: number) => {
    const icons = {
      1: "building",
      2: "database", 
      3: "award",
      4: "book-open"
    };
    return icons[day as keyof typeof icons];
  };

  const getDayStatus = (day: number) => {
    if (completedDays.includes(day)) {
      return { icon: "check", color: "bg-green-500" };
    }

    const currentModuleFromDB = progress?.currentModule || 1;

    if (day <= currentModuleFromDB) {
      return { icon: "clock", color: day === currentDay ? "bg-dwu-blue" : "bg-blue-500" };
    }

    return { icon: "clock", color: "bg-slate-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Modern Header */}
      <header className="glass-effect border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 slide-in-left">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg tech-border">
                <Building className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">DWU Academy</h1>
                <p className="text-sm text-slate-400">Centro de Excelência Técnica</p>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="flex-1 max-w-lg mx-8 fade-in">
              <div className="flex items-center justify-between text-sm text-slate-300 mb-3">
                <span className="font-medium">Jornada de Aprendizado</span>
                <span className="text-lg font-bold text-blue-400">{Math.round(overallProgress)}%</span>
              </div>
              <div className="relative">
                <Progress value={overallProgress} className="h-3 bg-slate-800 border border-slate-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center space-x-4 slide-in-right">
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLocation("/admin")}
                  className="hover:bg-slate-800/50 rounded-xl transition-all duration-300 text-slate-400 hover:text-white"
                >
                  <Shield className="mr-2" size={16} />
                  Admin
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="hover:bg-slate-800/50 rounded-xl transition-all duration-300"
              >
                <UserCircle className="text-slate-400 hover:text-white transition-colors" size={24} />
              </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="hover:bg-slate-800/50 rounded-xl transition-all duration-300"
                >
                  <LogOut className="text-slate-400 hover:text-white transition-colors" size={24} />
                </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Modern Sidebar Navigation */}
        <nav className="w-96 glass-effect border-r border-slate-700/50 min-h-screen backdrop-blur-xl slide-in-left">
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold gradient-text mb-2">Trilha de Conhecimento</h3>
              <p className="text-slate-400 text-sm">Sua jornada para se tornar um especialista DWU</p>
            </div>

            <div className="space-y-4">
              {onboardingData.map((day, index) => {
                const status = getDayStatus(day.day);
                const isActive = currentDay === day.day;
                const isCompleted = completedDays.includes(day.day);

                const currentModuleFromDB = progress?.currentModule || 1;
                const isUnlocked = day.day <= currentModuleFromDB;

                console.log(`📋 Módulo ${day.day} - Ativo: ${isActive}, Completado: ${isCompleted}, Desbloqueado: ${isUnlocked}, CurrentModule: ${currentModuleFromDB}`);

                const dayColors = [
                  'from-blue-500 to-blue-600',
                  'from-green-500 to-green-600', 
                  'from-purple-500 to-purple-600',
                  'from-orange-500 to-orange-600',
                  'from-pink-500 to-pink-600'
                ];

                return (
                  <div
                    key={day.day}
                    className={`day-nav-item group ${isActive ? 'active' : ''} fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => isUnlocked && switchDay(day.day)}
                  >
                    <div className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 tech-border ${
                      isActive ? 'glass-effect scale-105 shadow-2xl' : 'bg-slate-900/50 hover:bg-slate-800/50'
                    } ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 hover:shadow-xl'}`}>

                      {/* Day number badge */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${dayColors[index]} flex items-center justify-center mb-4 shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                        <span className="text-lg text-white font-bold">{day.day}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                          Módulo {day.day}
                        </h4>
                        <p className={`text-sm mb-3 ${isUnlocked ? 'text-slate-300' : 'text-slate-600'}`}>
                          {day.title}
                        </p>
                        <p className={`text-xs ${isUnlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                          {day.description}
                        </p>
                      </div>

                      {/* Status indicator */}                      <div className="absolute top-4 right-4">
                        {completedDays.includes(day.day) ? (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        ) : isActive ? (
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white text-xs">▶</span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                            <span className="text-slate-400 text-xs">⏰</span>
                          </div>
                        )}
                      </div>

                      {/* Progress line for active day */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-green-500 rounded-r-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Stats */}
            <div className="mt-8 p-6 tech-border glass-effect rounded-2xl">
              <h4 className="text-xl font-bold mb-4 gradient-text">Seu Progresso</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Módulos Completos</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-400">{completedDays.length}</span>
                    <span className="text-slate-400">/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Tempo Investido</span>
                  <span className="text-blue-400 font-semibold">~{completedDays.length * 1.6}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Nível de Expertise</span>
                  <span className="text-purple-400 font-semibold">
                    {completedDays.length === 0 ? 'Iniciante' : 
                     completedDays.length <= 2 ? 'Aprendiz' :
                     completedDays.length <= 4 ? 'Avançado' : 'Especialista'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-8 fade-in">
          <div className="max-w-5xl mx-auto">
            <ModuleContent 
              day={currentDay} 
              onProgressUpdate={() => {}}
              showEvaluation={showEvaluation}
              onEvaluationComplete={handleEvaluationComplete}
              onCancelEvaluation={handleCancelEvaluation}
            />

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-700/50">
              <Button
                variant="outline"
                onClick={previousDay}
                disabled={currentDay === 1}
                className={`${currentDay === 1 ? 'invisible' : ''} 
                  glass-effect border-slate-600 hover:border-blue-400 hover:bg-slate-800/50 
                  transition-all duration-300 rounded-xl px-6 py-3`}
              >
                <ChevronLeft className="mr-2" size={18} />
                Módulo Anterior
              </Button>

              {/* Module indicator */}
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4].map((day) => (
                  <div
                    key={day}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      day === currentDay 
                        ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50' 
                        : day < currentDay 
                        ? 'bg-green-500' 
                        : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                {!completedDays.includes(currentDay) && (
                  <Button
                    onClick={() => handleDayCompletion(currentDay)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
                      text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 
                      transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle className="mr-2" size={18} />
                    Concluir Módulo {currentDay}
                  </Button>
                )}

                <Button
                  onClick={nextDay}
                  disabled={currentDay === 4 || currentDay >= (progress?.currentModule || 1)}
                  className={`${
                    currentDay === 4 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : currentDay >= (progress?.currentModule || 1)
                      ? 'bg-slate-600 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  } 
                    text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300`}
                >
                  {currentDay === 4 ? (
                    <>
                      <span>Finalizar Certificação</span>
                      <ChevronRight className="ml-2" size={18} />
                    </>
                  ) : (
                    <>
                      <span>Próximo Módulo</span>
                      <ChevronRight className="ml-2" size={18} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Day Completion Modal */}
      <DayCompletionModal
        day={pendingCompletionDay || 1}
        isOpen={showCompletionModal}
        onConfirm={confirmDayCompletion}
        onCancel={cancelDayCompletion}
      />
    </div>
  );
}