import { users, onboardingProgress, moduleEvaluations, avaliacao_user, dailyAttempts, certificates, userAchievements, userLogins, type User, type InsertUser, type Certificate, type UserAchievement, type UserLogin } from "@shared/schema";
import { getDatabase } from "./database";
import type { OnboardingProgress, InsertOnboardingProgress } from "@/hooks/useProgress";
import { eq, and, desc, sql, gte } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProgress(userId: string): Promise<OnboardingProgress | undefined>;
  createProgress(progress: InsertOnboardingProgress): Promise<OnboardingProgress>;
  updateProgress(userId: string, updates: Partial<OnboardingProgress>): Promise<OnboardingProgress | undefined>;
  saveModuleEvaluation(data: { userId: string; moduleId: number; score: number; passed: boolean; answers: Record<string, number>; completedAt: string; totalQuestions?: number; correctAnswers?: number; timeSpent?: number }): Promise<any>;
  getModuleEvaluations(userId: string): Promise<any[]>;
  saveAvaliacaoUser(data: { userId: number; passed: boolean }): Promise<any>;
  getAvaliacaoHistory(userId: string): Promise<any>;
  // Missing methods that routes.ts expects
  saveEvaluation(data: any): Promise<any>;
  getEvaluationHistory(userId: string, moduleNumber?: number): Promise<any[]>;
  getAllEvaluations(): Promise<any[]>;
  getUserAllAttempts(userId: string): Promise<any[]>;
  getModuleStats(moduleNumber: number): Promise<any>;
  getAttemptCount(userId: string, moduleNumber?: number): Promise<number>;
  getTotalUserAttempts(userId: string): Promise<number>;
  saveEvaluationAttempt(data: any): Promise<any>;
  getUserEvaluationData(userId: string): Promise<any>;
  syncProgressWithEvaluations(userId: string): Promise<OnboardingProgress | undefined>;
  checkDailyAttempts(userId: string, moduleId: number): Promise<{ canAttempt: boolean; remainingTime?: number }>;
  recordAttempt(userId: string, moduleId: number): Promise<void>;
  checkAndUpdateDeadline(userId: string): Promise<{ isExpired: boolean; deadline: Date }>;
  generateCertificate(userId: string, userName: string): Promise<Certificate | null>;
  getCertificate(certificateId: string): Promise<Certificate | null>;
  calculateConsecutiveDays(userId: string): Promise<number>;
  recordUserLogin(userId: string, ipAddress?: string, userAgent?: string): Promise<UserLogin | null>;
  getUserLogins(userId: string): Promise<UserLogin[]>;
}

export class DatabaseStorage implements IStorage {
  private db = getDatabase();

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getProgress(userId: string): Promise<OnboardingProgress | undefined> {
    const result = await this.db.select().from(onboardingProgress).where(eq(onboardingProgress.user_id, userId));
    if (!result[0]) return undefined;

    // Map database fields to frontend interface
    const dbProgress = result[0];
    return {
      ...dbProgress,
      currentModule: dbProgress.current_module || 1,
      completedModules: dbProgress.completed_modules || [],
      moduleProgress: dbProgress.module_progress || {},
      moduleEvaluations: dbProgress.module_evaluations || {},
      // Also map to the alternative names used by frontend
      completedDays: dbProgress.completed_modules || [],
      dayProgress: dbProgress.module_progress || {},
      quizResults: dbProgress.module_evaluations || {}
    };
  }

  async createProgress(insertProgress: InsertOnboardingProgress): Promise<OnboardingProgress> {
    const progressData = {
      user_id: insertProgress.userId,
      current_module: insertProgress.currentModule || 1,
      completed_modules: insertProgress.completedModules || [],
      module_progress: insertProgress.moduleProgress || {},
      module_evaluations: insertProgress.moduleEvaluations || {},
      completed_at: insertProgress.completedAt || null,
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log("Creating progress with data:", progressData);
    const result = await this.db.insert(onboardingProgress).values(progressData).returning();
    return result[0];
  }

  async updateProgress(userId: string, updates: Partial<OnboardingProgress>): Promise<OnboardingProgress | undefined> {
    try {
      console.log("Updating progress for userId:", userId, "with updates:", updates);

      // Map the updates to the correct database field names
      const dbUpdates: any = {};
      if (updates.currentModule !== undefined) dbUpdates.current_module = updates.currentModule;
      if (updates.completedModules !== undefined) dbUpdates.completed_modules = updates.completedModules;
      if (updates.moduleProgress !== undefined) dbUpdates.module_progress = updates.moduleProgress;
      if (updates.moduleEvaluations !== undefined) dbUpdates.module_evaluations = updates.moduleEvaluations;
      if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;

      // Map completedDays to completed_modules (these are the same concept)
      if (updates.completedDays !== undefined) dbUpdates.completed_modules = updates.completedDays;

      // Map dayProgress to module_progress (these are the same concept)
      if (updates.dayProgress !== undefined) dbUpdates.module_progress = updates.dayProgress;

      // Map quizResults to module_evaluations (these are the same concept)
      if (updates.quizResults !== undefined) dbUpdates.module_evaluations = updates.moduleEvaluations;

      // Map currentDay to current_module (frontend uses currentDay sometimes)
      if (updates.currentDay !== undefined) dbUpdates.current_module = updates.currentDay;

      // Always update the updated_at timestamp
      dbUpdates.updated_at = new Date();

      console.log("Mapped updates for database:", dbUpdates);

      const result = await this.db
        .update(onboardingProgress)
        .set(dbUpdates)
        .where(eq(onboardingProgress.user_id, userId))
        .returning();

      console.log("Update result:", result);

      // Map database fields back to frontend interface
      const dbProgress = result[0];
      if (dbProgress) {
        return {
          ...dbProgress,
          currentModule: dbProgress.current_module || 1,
          completedModules: dbProgress.completed_modules || [],
          moduleProgress: dbProgress.module_progress || {},
          moduleEvaluations: dbProgress.module_evaluations || {},
          // Also map to the alternative names used by frontend
          completedDays: dbProgress.completed_modules || [],
          dayProgress: dbProgress.module_progress || {},
          quizResults: dbProgress.module_evaluations || {}
        };
      }

      return result[0];
    } catch (error) {
      console.error("Error in updateProgress:", error);

      // If update fails, try to create the record
      try {
        console.log("Attempting to create new progress record...");
        const newProgress = await this.createProgress({
          userId,
          currentModule: updates.currentModule || 1,
          completedModules: updates.completedModules || [],
          moduleProgress: updates.moduleProgress || {},
          moduleEvaluations: updates.moduleEvaluations || {},
          completedAt: updates.completedAt
        });
        return newProgress;
      } catch (createError) {
        console.error("Error creating progress:", createError);
        throw createError;
      }
    }
  }

  async saveModuleEvaluation(data: { userId: string; moduleId: number; score: number; passed: boolean; answers: Record<string, number>; completedAt: string; totalQuestions?: number; correctAnswers?: number; timeSpent?: number }): Promise<any> {
    console.log("Saving module evaluation:", data);
    try {
      // Calcular número da tentativa para este módulo
      const attemptCount = await this.getAttemptCount(data.userId, data.moduleId);
      const attemptNumber = attemptCount + 1;

      // Calcular respostas corretas se não fornecido
      const correctAnswers = data.correctAnswers || Math.floor((data.score / 100) * (data.totalQuestions || 20));

      // Inserir usando o schema Drizzle - garantir que userId seja string numérica
      const numericUserId = data.userId.toString().replace('user-', '');

      const result = await this.db.insert(moduleEvaluations).values({
        user_id: numericUserId,
        module_id: data.moduleId,
        attempt_number: attemptNumber,
        score: data.score,
        total_questions: data.totalQuestions || 20,
        correct_answers: correctAnswers,
        passed: data.passed,
        answers: data.answers,
        time_spent: data.timeSpent || null,
        completed_at: new Date(data.completedAt)
      }).returning();

      console.log("AVALIAÇÃO SALVA NO BANCO - Usuário:", data.userId, "Módulo:", data.moduleId, "Tentativa:", attemptNumber, "Score:", data.score, "Passou:", data.passed);
      return result[0];
    } catch (error) {
      console.error("Error saving to database:", error);
      console.log("REGISTRO DE AVALIAÇÃO (LOG) - USUÁRIO:", data.userId, "MÓDULO:", data.moduleId, "NOTA:", data.score, "PASSOU:", data.passed ? "SIM" : "NÃO", "DATA:", data.completedAt);
      return { success: true, logged: true };
    }
  }

  async getModuleEvaluations(userId: string): Promise<any[]> {
    try {
      const result = await this.db.execute(sql`
        SELECT * FROM module_evaluations WHERE userId = ${userId}
      `);
      return result.rows || [];
    } catch (error) {
      console.error("Error getting module evaluations:", error);
      return [];
    }
  }

  async saveAvaliacaoUser(data: { userId: number; passed: boolean }) {
    console.log("DatabaseStorage.saveAvaliacaoUser called with:", JSON.stringify(data, null, 2));
    try {
      // Primeiro, garantir que a tabela existe
      await this.db.execute(sql`
        CREATE TABLE IF NOT EXISTS avaliacao_user (
          id SERIAL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          passed BOOLEAN NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )
      `);

      // Inserir o registro
      const result = await this.db.execute(sql`
        INSERT INTO avaliacao_user ("userId", passed, "createdAt")
        VALUES (${data.userId.toString()}, ${data.passed}, NOW())
        RETURNING *
      `);

      console.log("REGISTRO SALVO NA TABELA avaliacao_user - Usuário:", data.userId, "Passou:", data.passed);
      return { id: Date.now(), userId: data.userId, passed: data.passed, createdAt: new Date() };
    } catch (error) {
      console.error("Erro ao salvar na avaliacao_user:", error);
      throw error;
    }
  }

  async getAvaliacaoHistory(userId: string) {
    try {
      // Handle both string and numeric user IDs
      const userIdInt = parseInt(userId.replace('user-', ''));
      if (isNaN(userIdInt)) {
        console.log("Invalid userId format:", userId);
        return [];
      }

      const result = await this.db.select().from(avaliacao_user)
        .where(eq(avaliacao_user.userId, userIdInt))
        .orderBy(desc(avaliacao_user.createdAt));
      return result || [];
    } catch (error) {
      console.error("Error getting avaliacao history:", error);
      return [];
    }
  }

  // Missing methods implementation (simplified for now)
  async saveEvaluation(data: any) {
    console.log("DatabaseStorage.saveEvaluation called with:", data);
    try {
      // Save to module_evaluations table using the existing schema
      const result = await this.db.insert(moduleEvaluations).values({
        user_id: data.userId.toString(),
        module_id: data.moduleNumber,
        score: data.score,
        passed: data.passed,
        answers: data.answers || {},
        completed_at: new Date(data.completedAt || new Date())
      }).returning();

      console.log("Evaluation saved to module_evaluations table:", result[0]);
      return result[0];
    } catch (error) {
      console.error("Error saving evaluation:", error);
      return { id: Date.now(), ...data, createdAt: new Date().toISOString() };
    }
  }

  async getEvaluationHistory(userId: string, moduleNumber?: number) {
    console.log("DatabaseStorage.getEvaluationHistory called for userId:", userId);
    try {
      // Extract numeric ID from userId
      const numericUserId = userId.toString().replace('user-', '');

      // Use Drizzle ORM to get from module_evaluations table
      let whereCondition = eq(moduleEvaluations.user_id, numericUserId);

      if (moduleNumber) {
        whereCondition = and(
          eq(moduleEvaluations.user_id, numericUserId),
          eq(moduleEvaluations.module_id, moduleNumber)
        );
      }

      const result = await this.db
        .select()
        .from(moduleEvaluations)
        .where(whereCondition)
        .orderBy(desc(moduleEvaluations.completed_at));

      return result.map((evaluation) => ({
        id: evaluation.id,
        userId: evaluation.user_id,
        moduleNumber: evaluation.module_id,
        attemptNumber: evaluation.attempt_number,
        score: evaluation.score,
        passed: evaluation.passed,
        correctAnswers: evaluation.correct_answers,
        totalQuestions: evaluation.total_questions,
        timeSpent: evaluation.time_spent,
        answers: evaluation.answers || {},
        createdAt: evaluation.completed_at
      }));
    } catch (error) {
      console.error("Error getting evaluation history:", error);
      return [];
    }
  }

  async getAllEvaluations() {
    console.log("DatabaseStorage.getAllEvaluations called");
    try {
      const result = await this.db
        .select()
        .from(moduleEvaluations)
        .orderBy(desc(moduleEvaluations.completed_at));

      return result.map((evaluation) => ({
        id: evaluation.id,
        userId: evaluation.user_id,
        moduleNumber: evaluation.module_id,
        attemptNumber: evaluation.attempt_number,
        score: evaluation.score,
        passed: evaluation.passed,
        correctAnswers: evaluation.correct_answers,
        totalQuestions: evaluation.total_questions,
        timeSpent: evaluation.time_spent,
        createdAt: evaluation.completed_at
      }));
    } catch (error) {
      console.error("Error getting all evaluations:", error);
      return [];
    }
  }

  async getUserAllAttempts(userId: string) {
    try {
      const db = await getDatabase();
      const attempts = await db
        .select()
        .from(dailyAttempts)
        .where(eq(dailyAttempts.user_id, userId))
        .orderBy(desc(dailyAttempts.attempt_date));

      return attempts;
    } catch (error) {
      console.error("❌ Error getting all user attempts:", error);
      return [];
    }
  }

  // Métodos para conquistas
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const db = await getDatabase();
      const achievements = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.user_id, userId))
        .orderBy(desc(userAchievements.unlocked_at));

      return achievements;
    } catch (error) {
      console.error("❌ Error getting user achievements:", error);
      return [];
    }
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement | null> {
    try {
      const db = await getDatabase();

      // Verificar se já existe
      const existing = await db
        .select()
        .from(userAchievements)
        .where(
          and(
            eq(userAchievements.user_id, userId),
            eq(userAchievements.achievement_id, achievementId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        console.log("🏆 Conquista já desbloqueada:", achievementId);
        return existing[0];
      }

      // Inserir nova conquista
      const result = await db
        .insert(userAchievements)
        .values({
          user_id: userId,
          achievement_id: achievementId,
        })
        .returning();

      console.log("🏆 Nova conquista desbloqueada:", achievementId, "para usuário:", userId);
      return result[0];
    } catch (error) {
      console.error("❌ Error unlocking achievement:", error);
      return null;
    }
  }

  async calculateConsecutiveDays(userId: string): Promise<number> {
    try {
      const numericUserId = userId.replace('user-', '');

      // Buscar todos os logins do usuário ordenados por data
      const logins = await this.db
        .select()
        .from(userLogins)
        .where(eq(userLogins.user_id, numericUserId))
        .orderBy(userLogins.login_date);

      if (logins.length === 0) {
        console.log("📅 Nenhum login registrado, usando dados de avaliações como fallback");
        
        // Fallback para avaliações se não houver logins registrados
        const evaluations = await this.db
          .select()
          .from(moduleEvaluations)
          .where(eq(moduleEvaluations.user_id, numericUserId))
          .orderBy(moduleEvaluations.completed_at);

        if (evaluations.length === 0) return 0;

        const uniqueDates = [...new Set(
          evaluations.map(evaluation => 
            new Date(evaluation.completed_at).toDateString()
          )
        )].sort();

        return this.calculateConsecutiveFromDates(uniqueDates);
      }

      // Extrair datas únicas de login (apenas dia, sem horário)
      const uniqueDates = [...new Set(
        logins.map(login => 
          new Date(login.login_date).toDateString()
        )
      )].sort();

      console.log("📅 Datas únicas de login:", uniqueDates);

      return this.calculateConsecutiveFromDates(uniqueDates);
    } catch (error) {
      console.error("❌ Erro ao calcular dias consecutivos:", error);
      return 0;
    }
  }

  private calculateConsecutiveFromDates(uniqueDates: string[]): number {
    if (uniqueDates.length === 0) return 0;
    if (uniqueDates.length === 1) return 1;

    let maxConsecutive = 1;
    let currentConsecutive = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const previousDate = new Date(uniqueDates[i - 1]);
      
      // Calcular diferença em dias
      const daysDifference = Math.floor(
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDifference === 1) {
        // Dias consecutivos
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        // Quebra na sequência
        currentConsecutive = 1;
      }
    }

    console.log("📊 Máximo de dias consecutivos calculado:", maxConsecutive);
    return maxConsecutive;
  }

  async recordUserLogin(userId: string, ipAddress?: string, userAgent?: string): Promise<UserLogin | null> {
    try {
      // Converter userId para número se necessário (remove 'user-' prefix se existir)
      const numericUserId = userId.replace('user-', '');
      console.log("🔄 recordUserLogin - userId original:", userId);
      console.log("🔄 recordUserLogin - numericUserId:", numericUserId);
      console.log("🔄 recordUserLogin - ipAddress:", ipAddress);
      console.log("🔄 recordUserLogin - userAgent:", userAgent?.substring(0, 50) + "...");
      
      // Criar data atual no fuso horário de Brasília
      const nowBrasilia = new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"});
      const currentDate = new Date(nowBrasilia);
      console.log("📅 Data atual (Brasília):", currentDate.toISOString());
      
      // Verificar se já existe um login hoje para evitar múltiplos registros no mesmo dia
      const today = new Date(currentDate);
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      console.log("🔄 Verificando login existente para hoje entre:", today.toISOString(), "e", tomorrow.toISOString());

      const existingTodayLogin = await this.db
        .select()
        .from(userLogins)
        .where(
          and(
            eq(userLogins.user_id, numericUserId),
            gte(userLogins.login_date, today),
            sql`${userLogins.login_date} < ${tomorrow.toISOString()}`
          )
        )
        .limit(1);

      console.log("🔄 Logins encontrados para hoje:", existingTodayLogin.length);

      // SEMPRE REGISTRAR NOVO LOGIN PARA TESTE
      if (existingTodayLogin.length > 0) {
        console.log("📅 ⚠️ Login já registrado hoje para usuário:", numericUserId, "às", existingTodayLogin[0].login_date);
        console.log("📅 🧪 TESTE: Registrando novo login mesmo com existência prévia");
        // Não retornar aqui para permitir novo registro
      }

      // Registrar novo login com data em fuso horário de Brasília
      console.log("🔄 Inserindo novo registro de login...");
      const result = await this.db
        .insert(userLogins)
        .values({
          user_id: numericUserId,
          ip_address: ipAddress,
          user_agent: userAgent,
          login_date: currentDate,
        })
        .returning();

      console.log("📅 ✅ Novo login registrado com sucesso!");
      console.log("📅 - ID do registro:", result[0].id);
      console.log("📅 - Usuário:", result[0].user_id);
      console.log("📅 - Data (Brasília):", result[0].login_date);
      return result[0];
    } catch (error) {
      console.error("❌ ERRO CRÍTICO ao registrar login:");
      console.error("❌ Error object:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      return null;
    }
  }

  async getUserLogins(userId: string): Promise<UserLogin[]> {
    try {
      const numericUserId = userId.replace('user-', '');
      console.log("🔍 getUserLogins - userId:", userId, "numericUserId:", numericUserId);
      
      const result = await this.db
        .select()
        .from(userLogins)
        .where(eq(userLogins.user_id, numericUserId))
        .orderBy(desc(userLogins.login_date));

      console.log("🔍 getUserLogins - encontrados", result.length, "registros");
      
      if (result.length > 0) {
        console.log("🔍 getUserLogins - últimos 3 registros:");
        result.slice(0, 3).forEach((login, index) => {
          console.log(`   ${index + 1}. ID: ${login.id}, Data: ${login.login_date}, IP: ${login.ip_address}`);
        });
      }

      return result;
    } catch (error) {
      console.error("❌ Erro ao buscar logins do usuário:", error);
      console.error("❌ Error details:", error.message);
      return [];
    }
  }

  async checkAndUnlockAchievements(userId: string): Promise<string[]> {
    try {
      console.log("🏆 Verificando conquistas para usuário:", userId);

      // Buscar dados do progresso
      const progress = await this.getProgress(userId);
      if (!progress) return [];

      // Buscar avaliações do usuário
      const evaluations = await this.getUserEvaluationData(userId);

      const newAchievements: string[] = [];

      // Verificar "Primeiro Passo"
      if (progress.completed_modules && progress.completed_modules.length >= 1) {
        const unlocked = await this.unlockAchievement(userId, "first_module");
        if (unlocked) newAchievements.push("first_module");
      }

      // Verificar "Perfeccionista"
      const perfectScores = evaluations.evaluations?.filter(evaluation => evaluation.score === 100) || [];
      if (perfectScores.length > 0) {
        const unlocked = await this.unlockAchievement(userId, "perfectionist");
        if (unlocked) newAchievements.push("perfectionist");
      }

      // Verificar "Aprendiz Veloz"
      const fastCompletions = evaluations.evaluations?.filter(evaluation => 
        evaluation.time_spent && evaluation.time_spent < 7200
      ) || [];
      if (fastCompletions.length > 0) {
        const unlocked = await this.unlockAchievement(userId, "speed_learner");
        if (unlocked) newAchievements.push("speed_learner");
      }

      // Verificar "Dedicado" - usar cálculo real de dias consecutivos
      const consecutiveDays = await this.calculateConsecutiveDays(userId);
      if (consecutiveDays >= 5) {
        const unlocked = await this.unlockAchievement(userId, "dedicated");
        if (unlocked) newAchievements.push("dedicated");
      }

      // Verificar "Graduado DWU"
      if (progress.completed_modules && progress.completed_modules.length >= 4) {
        const unlocked = await this.unlockAchievement(userId, "graduate");
        if (unlocked) newAchievements.push("graduate");
      }

      // Verificar "Alto Desempenho"
      if (evaluations.evaluations && evaluations.evaluations.length > 0) {
        const allHighScores = evaluations.evaluations.every(evaluation => evaluation.score >= 90);
        if (allHighScores) {
          const unlocked = await this.unlockAchievement(userId, "high_achiever");
          if (unlocked) newAchievements.push("high_achiever");
        }
      }

      if (newAchievements.length > 0) {
        console.log("🏆 Novas conquistas desbloqueadas:", newAchievements);
      }

      return newAchievements;
    } catch (error) {
      console.error("❌ Error checking achievements:", error);
      return [];
    }
  }

  async getModuleStats(moduleNumber: number) {
    console.log("DatabaseStorage.getModuleStats called - returning basic stats");
    return { moduleNumber, totalAttempts: 0, avgScore: 0, passRate: 0 };
  }

  async getAttemptCount(userId: string, moduleNumber?: number) {
    console.log("DatabaseStorage.getAttemptCount called for userId:", userId, "moduleNumber:", moduleNumber);
    try {
      // Extract numeric ID from userId
      const numericUserId = userId.toString().replace('user-', '');

      let whereCondition = eq(moduleEvaluations.user_id, numericUserId);

      if (moduleNumber) {
        whereCondition = and(
          eq(moduleEvaluations.user_id, numericUserId),
          eq(moduleEvaluations.module_id, moduleNumber)
        );
      }

      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(moduleEvaluations)
        .where(whereCondition);

      return parseInt(result[0]?.count?.toString() || '0');
    } catch (error) {
      console.error("Error getting attempt count:", error);
      return 0;
    }
  }

  async getTotalUserAttempts(userId: string) {
    console.log("DatabaseStorage.getTotalUserAttempts called for userId:", userId);
    try {
      // Extract numeric ID from userId
      const numericUserId = userId.toString().replace('user-', '');

      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(moduleEvaluations)
        .where(eq(moduleEvaluations.user_id, numericUserId));

      return parseInt(result[0]?.count?.toString() || '0');
    } catch (error) {
      console.error("Error getting total user attempts:", error);
      return 0;
    }
  }

  async saveEvaluationAttempt(data: any) {
    console.log("DatabaseStorage.saveEvaluationAttempt called - not implemented");
    return { id: Date.now(), ...data, createdAt: new Date().toISOString() };
  }

  async getUserEvaluationData(userId: string): Promise<any> {
    console.log("DatabaseStorage.getUserEvaluationData called for userId:", userId);
    try {
      // Extract numeric ID from userId (remove 'user-' prefix if present)
      const numericUserId = userId.replace('user-', '');

      console.log("Searching for evaluations with userId:", numericUserId);

      // Get current module from onboarding progress
      const progressResult = await this.db
        .select()
        .from(onboardingProgress)
        .where(eq(onboardingProgress.user_id, userId.toString()));

      const currentModule = progressResult[0]?.current_module || 1;

      // Get all evaluations from module_evaluations table using numeric ID
      const evaluations = await this.db
        .select()
        .from(moduleEvaluations)
        .where(eq(moduleEvaluations.user_id, numericUserId))
        .orderBy(desc(moduleEvaluations.completed_at));

      console.log("Found evaluations:", evaluations.length);

      // Get total attempts count
      const totalAttempts = evaluations.length;

      // Format evaluations data
      const formattedEvaluations = evaluations.map((evaluation) => ({
        id: evaluation.id,
        userId: evaluation.user_id,
        moduleNumber: evaluation.module_id,
        attemptNumber: evaluation.attempt_number,
        score: evaluation.score,
        passed: evaluation.passed,
        correctAnswers: evaluation.correct_answers,
        totalQuestions: evaluation.total_questions,
        timeSpent: evaluation.time_spent,
        answers: evaluation.answers || {},
        createdAt: evaluation.completed_at
      }));

      // Group attempts by module for better visualization
      const attemptsByModule = evaluations.reduce((acc, evaluation) => {
        const moduleKey = `module_${evaluation.module_id}`;
        if (!acc[moduleKey]) {
          acc[moduleKey] = [];
        }
        acc[moduleKey].push({
          attemptNumber: evaluation.attempt_number,
          score: evaluation.score,
          correctAnswers: evaluation.correct_answers,
          totalQuestions: evaluation.total_questions,
          passed: evaluation.passed,
          timeSpent: evaluation.time_spent,
          createdAt: evaluation.completed_at
        });
        return acc;
      }, {});

      return {
        evaluations: formattedEvaluations,
        attempts: formattedEvaluations,
        totalEvaluations: totalAttempts,
        totalAttempts: totalAttempts,
        currentModule: currentModule,
        attemptsByModule: attemptsByModule,
        userProgress: progressResult[0] || null
      };
    } catch (error) {
      console.error("Error getting user evaluation data:", error);
      return {
        evaluations: [],
        attempts: [],
        totalEvaluations: 0,
        totalAttempts: 0,
        currentModule: 1,
        attemptsByModule: {},
        userProgress: null
      };
    }
  }

  async checkDailyAttempts(userId: string, moduleId: number): Promise<{ canAttempt: boolean; remainingTime?: number }> {
    try {
      console.log("🔍 Verificando tentativas diárias - userId:", userId, "moduleId:", moduleId);

      // Verificar tentativas nas últimas 24 horas, não apenas no dia atual
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      console.log("📅 24 horas atrás:", twentyFourHoursAgo);

      // Buscar avaliações nas últimas 24 horas da tabela module_evaluations
      const numericUserId = userId.toString().replace('user-', '');
      const recentEvaluations = await this.db
        .select()
        .from(moduleEvaluations)
        .where(
          and(
            eq(moduleEvaluations.user_id, numericUserId),
            eq(moduleEvaluations.module_id, moduleId),
            gte(moduleEvaluations.completed_at, twentyFourHoursAgo)
          )
        )
        .orderBy(desc(moduleEvaluations.completed_at));

      console.log("📊 Tentativas encontradas nas últimas 24h:", recentEvaluations.length);

      if (recentEvaluations.length >= 2) {
        const lastAttempt = recentEvaluations[0]; // Mais recente
        const nextAttemptTime = new Date(lastAttempt.completed_at.getTime() + 24 * 60 * 60 * 1000);
        const remainingTime = nextAttemptTime.getTime() - Date.now();

        console.log("❌ Limite excedido - próxima tentativa em:", Math.max(0, remainingTime), "ms");
        console.log("🕒 Última tentativa:", lastAttempt.completed_at);
        console.log("🕒 Próxima tentativa disponível em:", nextAttemptTime);

        return { 
          canAttempt: false, 
          remainingTime: Math.max(0, remainingTime),
          message: "Limite de 2 tentativas em 24 horas atingido. Tente novamente mais tarde.",
          lastAttempt: lastAttempt.completed_at.toISOString(),
          nextAttemptAt: nextAttemptTime.toISOString(),
          attemptCount: recentEvaluations.length,
          maxAttempts: 2
        };
      }

      console.log("✅ Pode tentar - tentativas restantes:", 2 - recentEvaluations.length);
      return { canAttempt: true };
    } catch (error) {
      console.error("Error checking daily attempts:", error);
      return { canAttempt: true };
    }
  }

  async recordAttempt(userId: string, moduleId: number): Promise<void> {
    // As tentativas agora são rastreadas automaticamente através da tabela module_evaluations
    // Esta função é mantida para compatibilidade, mas não faz nada
    console.log("📝 Tentativa será registrada automaticamente via module_evaluations");
  }

  async checkAndUpdateDeadline(userId: string): Promise<{ isExpired: boolean; deadline: Date }> {
    try {
      console.log("🔍 Verificando prazo para userId:", userId);

      // Buscar dados do usuário para obter data de criação
      const numericUserId = parseInt(userId.replace('user-', ''));
      console.log("🔍 NumericUserId extraído:", numericUserId);

      const user = await this.getUser(numericUserId);

      if (!user) {
        console.log("❌ Usuário não encontrado para ID:", numericUserId);
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 15);
        return { isExpired: false, deadline };
      }

      console.log("👤 Usuário encontrado:");
      console.log("   - ID:", user.id);
      console.log("   - Nome:", user.username);
      console.log("   - Email:", user.user_mail);
      console.log("   - Data de criação RAW:", user.created_at);

      // Garantir que a data seja parseada corretamente
      const userCreationDate = new Date(user.created_at);
      console.log("📅 Data de criação parseada:", userCreationDate.toISOString());

      // Verificar se a data é válida
      if (isNaN(userCreationDate.getTime())) {
        console.log("❌ Data de criação inválida, usando data atual");
        const fallbackDeadline = new Date();
        fallbackDeadline.setDate(fallbackDeadline.getDate() + 15);
        return { isExpired: false, deadline: fallbackDeadline };
      }

      // Calcular deadline: data de criação + 15 dias
      const deadline = new Date(userCreationDate.getTime());
      deadline.setDate(deadline.getDate() + 15);

      const now = new Date();
      const timeDifference = deadline.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      const isExpired = timeDifference <= 0;

      console.log("📊 CÁLCULO DE PRAZO:");
      console.log("   - Data de criação:", userCreationDate.toISOString());
      console.log("   - Data atual:", now.toISOString());
      console.log("   - Deadline (criação + 15d):", deadline.toISOString());
      console.log("   - Diferença em ms:", timeDifference);
      console.log("   - Dias restantes:", daysRemaining);
      console.log("   - Expirado:", isExpired);

      const progress = await this.getProgress(userId);

      if (!progress) {
        // Create initial progress se não existir
        console.log("📝 Criando progresso inicial para usuário");
        await this.createProgress({
          userId,
          currentModule: 1,
          completedModules: [],
          moduleProgress: {},
          moduleEvaluations: {},
          deadline: deadline.toISOString()
        });
      }

      if (isExpired && progress && !progress.is_expired) {
        // Reset progress if expired
        console.log("🔄 Resetando progresso - prazo expirado");
        const newDeadline = new Date();
        newDeadline.setDate(newDeadline.getDate() + 15);

        await this.updateProgress(userId, {
          currentModule: 1,
          completedModules: [],
          moduleProgress: {},
          moduleEvaluations: {},
          is_expired: true,
          deadline: newDeadline.toISOString()
        });

        return { isExpired: true, deadline: newDeadline };
      }

      return { isExpired, deadline };
    } catch (error) {
      console.error("❌ Error checking deadline:", error);
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 15);
      return { isExpired: false, deadline };
    }
  }

  async generateCertificate(userId: string, userName: string): Promise<Certificate | null> {
    try {
      const certificateId = `DWU-${Date.now()}-${userId}`;
      const completionDate = new Date();

      const certificate = await this.db
        .insert(certificates)
        .values({
          user_id: userId,
          certificate_id: certificateId,
          user_name: userName,
          completion_date: completionDate,
          certificate_url: `/api/certificates/${certificateId}`
        })
        .returning();

      return certificate[0];
    } catch (error) {
      console.error("Error generating certificate:", error);
      return null;
    }
  }

  async getCertificate(certificateId: string): Promise<Certificate | null> {
    try {
      const result = await this.db
        .select()
        .from(certificates)
        .where(eq(certificates.certificate_id, certificateId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Error getting certificate:", error);
      return null;
    }
  }

  async syncProgressWithEvaluations(userId: string): Promise<OnboardingProgress | undefined> {
    console.log("🔄 Sincronizando progresso com avaliações para userId:", userId);
    try {
      // Extract numeric ID from userId for module_evaluations table
      const numericUserId = userId.replace('user-', '');

      // Get current progress
      const progressResult = await this.db
        .select()
        .from(onboardingProgress)
        .where(eq(onboardingProgress.user_id, userId.toString()));

      let currentProgress = progressResult[0];

      // If no progress exists, create initial progress
      if (!currentProgress) {
        console.log("📝 Criando progresso inicial para usuário:", userId);
        currentProgress = await this.createProgress({
          userId,
          currentModule: 1,
          completedModules: [],
          moduleProgress: {},
          moduleEvaluations: {}
        });
      }

      // Get all evaluations for this user ordered by module and date
      const evaluations = await this.db
        .select()
        .from(moduleEvaluations)
        .where(eq(moduleEvaluations.user_id, numericUserId))
        .orderBy(moduleEvaluations.module_id, desc(moduleEvaluations.completed_at));

      console.log(`📊 Encontradas ${evaluations.length} avaliações para o usuário`);

      if (evaluations.length === 0) {
        console.log("📝 Nenhuma avaliação encontrada, mantendo progresso atual");
        return currentProgress;
      }

      // Group evaluations by module to get the latest for each module
      const latestEvaluationByModule = evaluations.reduce((acc, evaluation) => {
        if (!acc[evaluation.module_id] || evaluation.completed_at > acc[evaluation.module_id].completed_at) {
          acc[evaluation.module_id] = evaluation;
        }
        return acc;
      }, {} as Record<number, any>);

      console.log("📊 Última avaliação por módulo:", latestEvaluationByModule);

      // Calculate new progress based on evaluations
      let newCurrentModule = 1;
      const newCompletedModules: number[] = [];
      const newModuleEvaluations: Record<string, any> = {};

      // Check each module from 1 to 4
      for (let moduleId = 1; moduleId <= 4; moduleId++) {
        const latestEvaluation = latestEvaluationByModule[moduleId];

        if (latestEvaluation) {
          // Store the evaluation result
          newModuleEvaluations[moduleId.toString()] = {
            score: latestEvaluation.score,
            passed: latestEvaluation.passed,
            completedAt: latestEvaluation.completed_at.toISOString()
          };

          // If passed with score >= 90%, mark module as completed
          if (latestEvaluation.passed && latestEvaluation.score >= 90) {
            newCompletedModules.push(moduleId);
            console.log(`✅ Módulo ${moduleId} completado - Score: ${latestEvaluation.score}%, Passou: ${latestEvaluation.passed}`);

          // Set current module to next available module
            if (moduleId < 4) {
              newCurrentModule = moduleId + 1;
            } else {
              newCurrentModule = 4; // Stay at module 4 if it's the last one
            }
          } else {
            console.log(`❌ Módulo ${moduleId} não completado - Score: ${latestEvaluation.score}%, Passou: ${latestEvaluation.passed}`);
            // If this module was not passed, stop here
            break;
          }
        } else {
          // No evaluation for this module, stop here
          break;
        }
      }

      console.log(`🎯 Novo progresso calculado - Módulo atual: ${newCurrentModule}, Módulos completados: [${newCompletedModules.join(', ')}]`);

      // Update progress if there are changes
      const hasChanges = 
        currentProgress.current_module !== newCurrentModule ||
        JSON.stringify(currentProgress.completed_modules || []) !== JSON.stringify(newCompletedModules) ||
        JSON.stringify(currentProgress.module_evaluations || {}) !== JSON.stringify(newModuleEvaluations);

      if (hasChanges) {
        console.log("🔄 Atualizando progresso no banco...");
        const updatedProgress = await this.updateProgress(userId, {
          currentModule: newCurrentModule,
          completedModules: newCompletedModules,
          moduleEvaluations: newModuleEvaluations
        });

        console.log("✅ Progresso atualizado:", updatedProgress);
        return updatedProgress;
      } else {
        console.log("📝 Nenhuma mudança no progresso necessária");
        return currentProgress;
      }

    } catch (error) {
      console.error("❌ Erro ao sincronizar progresso:", error);
      return undefined;
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private progress: Map<string, OnboardingProgress>;
  private avaliacoes: Map<string, any[]>; // Simplified for memory storage
  private currentUserId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.progress = new Map();
    this.avaliacoes = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProgress(userId: string): Promise<OnboardingProgress | undefined> {
    return this.progress.get(userId);
  }

  async createProgress(insertProgress: InsertOnboardingProgress): Promise<OnboardingProgress> {
    const id = this.currentProgressId++;
    const progressData: OnboardingProgress = {
      id,
      ...insertProgress,
    };
    this.progress.set(insertProgress.userId, progressData);
    return progressData;
  }

  async updateProgress(userId: string, updates: Partial<OnboardingProgress>): Promise<OnboardingProgress | undefined> {
    const existing = this.progress.get(userId);
    if (!existing) {
      return undefined;
    }

    const updated: OnboardingProgress = {
      ...existing,
      ...updates,
    };

    this.progress.set(userId, updated);
    return updated;
  }

  async saveModuleEvaluation(data: { userId: string; moduleId: number; score: number; passed: boolean; answers: Record<string, number>; completedAt: string }): Promise<any> {
    console.log("MemStorage - Saving module evaluation:", data);
    const evaluationRecord = {
      id: Date.now(),
      userId: data.userId,
      moduleId: data.moduleId,
      score: data.score,
      passed: data.passed,
      answers: data.answers,
      completedAt: data.completedAt,
      createdAt: new Date().toISOString()
    };

    const existing = this.avaliacoes.get(data.userId) || [];
    existing.push(evaluationRecord);
    this.avaliacoes.set(data.userId, existing);

    console.log("AVALIAÇÃO REGISTRADA (MEMÓRIA) - Usuário:", data.userId, "Módulo:", data.moduleId, "Score:", data.score, "Passou:", data.passed);
    return evaluationRecord;
  }

  async getModuleEvaluations(userId: string): Promise<any[]> {
    return this.avaliacoes.get(userId) || [];
  }

  async saveAvaliacaoUser(data: { userId: number; passed: boolean }) {
    const dataWithTimestamp = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    const existing = this.avaliacoes.get(data.userId.toString()) || [];
    existing.push(dataWithTimestamp);
    this.avaliacoes.set(data.userId.toString(), existing);
    return dataWithTimestamp;
  }

  async getAvaliacaoHistory(userId: string) {
    return this.avaliacoes.get(userId) || [];
  }

  // Missing methods implementation for MemStorage
  async saveEvaluation(data: any) {
    const dataWithTimestamp = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    return dataWithTimestamp;
  }

  async getEvaluationHistory(userId: string, moduleNumber?: number) {
    return this.getAvaliacaoHistory(userId);
  }

  async getAllEvaluations() {
    const allEvals = [];
    for (const userEvals of this.avaliacoes.values()) {
      allEvals.push(...userEvals);
    }
    return allEvals;
  }

  async getUserAllAttempts(userId: string) {
    return [];
  }

  async getModuleStats(moduleNumber: number) {
    return { moduleNumber, totalAttempts: 0, avgScore: 0, passRate: 0 };
  }

  async getAttemptCount(userId: string, moduleNumber?: number) {
    return 0;
  }

  async getTotalUserAttempts(userId: string) {
    const userEvaluations = this.avaliacoes.get(userId) || [];
    return userEvaluations.length;
  }

  async saveEvaluationAttempt(data: any) {
    const dataWithTimestamp = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    return dataWithTimestamp;
  }

  async getUserEvaluationData(userId: string): Promise<any> {
      return {
        evaluations: [],
        attempts: [],
        totalEvaluations: 0,
        totalAttempts: 0,
        currentModule: 1,
        attemptsByModule: {},
        userProgress: null
      };
  }

    async checkDailyAttempts(userId: string, moduleId: number): Promise<{ canAttempt: boolean; remainingTime?: number }> {
    return { canAttempt: true };
  }

  async recordAttempt(userId: string, moduleId: number): Promise<void> {
    // Do nothing in memory storage
  }

  async checkAndUpdateDeadline(userId: string): Promise<{ isExpired: boolean; deadline: Date }> {
     const deadline = new Date();
      deadline.setDate(deadline.getDate() + 15);
      return { isExpired: false, deadline };
  }

  async generateCertificate(userId: string, userName: string): Promise<Certificate | null> {
      return null;
  }

  async getCertificate(certificateId: string): Promise<Certificate | null> {
    return null;
  }

  async syncProgressWithEvaluations(userId: string): Promise<OnboardingProgress | undefined> {
    // Simplified implementation for memory storage
    return this.progress.get(userId);
  }

  async calculateConsecutiveDays(userId: string): Promise<number> {
    // Simplified implementation for memory storage
    return 0;
  }

  async recordUserLogin(userId: string, ipAddress?: string, userAgent?: string): Promise<UserLogin | null> {
    // Simplified implementation for memory storage
    return null;
  }

  async getUserLogins(userId: string): Promise<UserLogin[]> {
    // Simplified implementation for memory storage
    return [];
  }
}

// Use DatabaseStorage with Supabase
const DATABASE_URL = "postgresql://postgres.brjwbznxsfbtoktpdssw:oBfiPmNzLW81Hz1b@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
process.env.DATABASE_URL = DATABASE_URL;

console.log("🚀 Initializing DatabaseStorage with Supabase...");
let selectedStorage: IStorage = new DatabaseStorage();

export const storage: IStorage = selectedStorage;

console.log("📦 Final storage type:", storage.constructor.name);