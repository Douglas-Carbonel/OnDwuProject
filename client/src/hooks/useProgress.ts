
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

  const { data: progress, isLoading: loading } = useQuery({
    queryKey: ["/api/progress", userId],
    queryFn: async () => {
      try {
        console.log("🔍 Fetching progress for user:", userId);
        const response = await fetch(`/api/progress/${userId}`, {
          credentials: "include",
        });
        
        if (response.status === 404) {
          // Create initial progress if not found
          console.log("📝 Creating initial progress for user:", userId);
          const initResponse = await apiRequest("POST", "/api/progress", {
            userId,
            currentModule: 1,
            completedModules: [],
            moduleProgress: {},
            moduleEvaluations: {},
            completedAt: null
          });
          const result = await initResponse.json();
          console.log("✅ Initial progress created:", result);
          return result;
        }
        
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("✅ Progress fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("❌ Error fetching progress:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 500,
    staleTime: 0, // Sempre buscar dados frescos
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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
    
    const updates = {
      currentModule: Math.max(progress.currentModule || 1, day),
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
    
    updateProgress({
      moduleEvaluations: newModuleEvaluations
    });
  }, [progress, updateProgress]);

  // Não inicializar automaticamente - deixar o queryFn handle isso apenas quando necessário

  return {
    progress,
    loading: loading || updateProgressMutation.isPending,
    updateProgress,
    updateDayProgress,
    saveQuizResult,
    userId,
    isUpdating: updateProgressMutation.isPending,
    error: updateProgressMutation.error
  };
}
