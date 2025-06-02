import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface OnboardingProgress {
  userId: string;
  currentModule: number;
  completedModules: number[];
  moduleProgress: Record<string, number>;
  moduleEvaluations: Record<string, { score: number; passed: boolean; completedAt: string }>;
  completedAt?: string;
  // Alternative names used by components
  completedDays?: number[];
  dayProgress?: Record<string, number>;
  quizResults?: Record<string, { score: number; passed: boolean; completedAt?: string }>;
}

export function useProgress() {
  const [userId] = useState(() => {
    let id = localStorage.getItem("dwu-user-id");
    if (!id) {
      id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("dwu-user-id", id);
    }
    return id;
  });

  const queryClient = useQueryClient();

  const { data: progress, isLoading: loading, refetch } = useQuery({
    queryKey: ["progress", userId],
    queryFn: async () => {
      try {
        // First try to sync progress with evaluations
        try {
          await apiRequest("POST", `/api/sync-progress/${userId}`);
          console.log("✅ Progresso sincronizado automaticamente");
        } catch (syncError) {
          console.log("⚠️ Erro na sincronização automática, continuando...", syncError);
        }

        // Then get the updated progress
        return await apiRequest("GET", `/api/progress/${userId}`);
      } catch (error) {
        console.log("⚠️ Progress not found, creating initial progress");
        return await apiRequest("POST", "/api/progress", {
          userId,
          currentModule: 1,
          completedModules: [],
          moduleProgress: {},
          moduleEvaluations: {},
        });
      }
    },
    enabled: !!userId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (updates: Partial<OnboardingProgress>) => {
      try {
        console.log("🔄 Updating progress in database:", updates);
        const response = await apiRequest("PUT", `/api/progress/${userId}`, updates);
        const result = await response.json();
        console.log("✅ Progress updated successfully:", result);
        return result;
      } catch (error) {
        console.error("❌ Error updating progress:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Update the cache directly and ensure it's persisted
      console.log("🔄 Updating cache with new data:", data);
      queryClient.setQueryData(["/api/progress", userId], data);

      // Force a re-render by invalidating after setting data
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/progress", userId],
          refetchType: 'active'
        });
      }, 100);
    },
    onError: (error) => {
      console.error("❌ Failed to update progress:", error);
      // Invalidate and refetch on error
      queryClient.invalidateQueries({ queryKey: ["/api/progress", userId] });
    },
  });

  const updateProgress = (updates: Partial<OnboardingProgress>) => {
    if (!progress && !updates.completedModules && !updates.moduleProgress) {
      console.log("⚠️ No existing progress and no complete update data, skipping");
      return;
    }

    // Se estamos atualizando currentDay, também atualizar currentModule
    if (updates.currentDay && !updates.currentModule) {
      updates.currentModule = updates.currentDay;
    }

    // Merge com dados existentes para garantir que não perdemos informações
    const safeUpdates = {
      completedModules: updates.completedModules || updates.completedDays || progress?.completedModules || [],
      moduleProgress: updates.moduleProgress || updates.dayProgress || progress?.moduleProgress || {},
      moduleEvaluations: updates.moduleEvaluations || updates.quizResults || progress?.moduleEvaluations || {},
      currentModule: updates.currentModule || progress?.currentModule || 1,
      ...updates, // Sobrescrever com atualizações explícitas
    };

    console.log("🔄 Merging progress update:", {
      existing: progress,
      updates: updates,
      final: safeUpdates
    });

    updateProgressMutation.mutate(safeUpdates);
  };

  const updateDayProgress = useCallback((day: number, dayProgressValue: number) => {
    if (!progress) {
      console.log("⚠️ Progress not loaded yet, skipping update");
      return;
    }

    // Only update if the value actually changed
    if (progress.moduleProgress?.[day] === dayProgressValue) {
      console.log(`📊 Day ${day} progress unchanged at ${dayProgressValue}%`);
      return;
    }

    console.log(`📊 Updating day ${day} progress to ${dayProgressValue}%`);

    const newModuleProgress = { ...progress.moduleProgress, [day]: dayProgressValue };

    let newCompletedModules = [...(progress.completedModules || [])];

    // Mark module as completed if progress is 100% and not already completed
    if (dayProgressValue === 100 && !newCompletedModules.includes(day)) {
      newCompletedModules.push(day);
      console.log(`✅ Module ${day} marked as completed`);
    }

    // Calculate next available module
    const nextModule = dayProgressValue === 100 ? Math.min(day + 1, 4) : Math.max(progress.currentModule || 1, day);

    const updates = {
      currentModule: nextModule,
      moduleProgress: newModuleProgress,
      completedModules: newCompletedModules,
      ...(newCompletedModules.length === 4 ? { completedAt: new Date().toISOString() } : {})
    };

    updateProgress(updates);
  }, [progress, updateProgress]);

  const saveQuizResult = useCallback((moduleNumber: number, score: number, passed: boolean) => {
    if (!progress) {
      console.log("⚠️ Progress not loaded yet, skipping quiz result save");
      return;
    }

    console.log(`📝 Saving quiz result for module ${moduleNumber}: ${score}% (${passed ? 'PASSED' : 'FAILED'})`);

    const newModuleEvaluations = {
      ...progress.moduleEvaluations,
      [moduleNumber]: { 
        score, 
        passed, 
        completedAt: new Date().toISOString() 
      }
    };

    // Se passou na avaliação, marcar módulo como completo e liberar próximo
    let updates: any = {
      moduleEvaluations: newModuleEvaluations
    };

    if (passed) {
      const newCompletedModules = [...(progress.completedModules || [])];
      if (!newCompletedModules.includes(moduleNumber)) {
        newCompletedModules.push(moduleNumber);
      }

      const newModuleProgress = { ...progress.moduleProgress, [moduleNumber]: 100 };
      const nextModule = Math.min(moduleNumber + 1, 4);

      updates = {
        ...updates,
        completedModules: newCompletedModules,
        moduleProgress: newModuleProgress,
        currentModule: nextModule,
        ...(newCompletedModules.length === 4 ? { completedAt: new Date().toISOString() } : {})
      };

      console.log(`✅ Module ${moduleNumber} completed! Next module: ${nextModule}`);
    }

    updateProgress(updates);
  }, [progress, updateProgress]);

  const completeModule = useCallback((moduleNumber: number) => {
    if (!progress) return;

    const newCompletedModules = [...(progress.completedModules || [])];
    if (!newCompletedModules.includes(moduleNumber)) {
      newCompletedModules.push(moduleNumber);
    }

    const newModuleProgress = { ...progress.moduleProgress, [moduleNumber]: 100 };
    const nextModule = Math.min(moduleNumber + 1, 4);

    const updates = {
      completedModules: newCompletedModules,
      moduleProgress: newModuleProgress,
      currentModule: nextModule,
      ...(newCompletedModules.length === 4 ? { completedAt: new Date().toISOString() } : {})
    };

    console.log(`🎯 Completing module ${moduleNumber}, next: ${nextModule}`);
    updateProgress(updates);

    return nextModule;
  }, [progress, updateProgress]);

  // Não inicializar automaticamente - deixar o queryFn handle isso apenas quando necessário

  return {
    progress,
    loading: loading || updateProgressMutation.isPending,
    updateProgress,
    updateDayProgress,
    saveQuizResult,
    completeModule,
    userId,
    isUpdating: updateProgressMutation.isPending,
    error: updateProgressMutation.error
  };
}