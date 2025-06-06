import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgressSchema } from "@shared/schema";
import { testSupabaseConnection } from "./test-connection";
import { authService } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {

  // Add logging middleware
  app.use((req, res, next) => {
    if (req.path.includes('/api/evaluations')) {
      console.log(`🚀 ${req.method} ${req.path} - Body:`, JSON.stringify(req.body, null, 2));
    }
    next();
  });

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      const user = await authService.validateUser(email, password);

      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Record user login for consecutive days tracking
      try {
        await storage.recordUserLogin(
          user.id.toString(), 
          req.ip || req.connection.remoteAddress,
          req.get('User-Agent')
        );
        console.log("📅 Login registrado com sucesso para usuário:", user.id);
      } catch (loginError) {
        console.error("❌ Erro ao registrar login:", loginError);
        // Don't fail login if login recording fails
      }

      // Sync progress with evaluations after successful login
      console.log("🔄 Sincronizando progresso após login para usuário:", user.id);
      try {
        await storage.syncProgressWithEvaluations(user.id.toString());
        console.log("✅ Progresso sincronizado com sucesso");
      } catch (syncError) {
        console.error("❌ Erro ao sincronizar progresso:", syncError);
        // Don't fail login if sync fails, just log the error
      }

      res.json({
        success: true,
        user: {
          userId: user.id.toString(),
          name: user.username,
          email: user.user_mail,
          profile: user.user_profile,
        }
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Register route
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, profile = "colaborador", address, phone } = req.body;

      console.log("🚀 Tentativa de registro:", { username, email, profile });

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      if (!["colaborador", "admin"].includes(profile)) {
        return res.status(400).json({ message: "Perfil inválido" });
      }

      // Verificar se já existe um usuário com este email
      const existingUser = await authService.debugFindUser(email);
      if (existingUser) {
        console.log("❌ Email já cadastrado:", email);
        return res.status(400).json({ message: "Este email já está cadastrado no sistema" });
      }

      const user = await authService.createUser({
        username,
        password,
        user_mail: email,
        user_profile: profile,
        address,
        phone,
      });

      if (!user) {
        console.log("❌ Falha na criação do usuário");
        return res.status(400).json({ message: "Erro ao criar usuário. Tente novamente." });
      }

      console.log("✅ Usuário criado com sucesso:", user.username);

      res.json({
        success: true,
        user: {
          userId: user.id.toString(),
          name: user.username,
          email: user.user_mail,
          profile: user.user_profile,
        }
      });
    } catch (error) {
      console.error("❌ Erro durante registro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Test Supabase connection
  app.get("/api/test-supabase", async (req, res) => {
    try {
      const result = await testSupabaseConnection();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao testar conexão'
      });
    }
  });

  // Admin middleware
  const requireAdmin = async (req: any, res: any, next: any) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const user = await authService.getUserById(parseInt(userId));
      if (!user || user.user_profile !== "admin") {
        return res.status(403).json({ message: "Acesso negado. Apenas administradores podem acessar esta funcionalidade." });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in admin middleware:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  // Debug route to check user in database
  app.get("/api/debug/user/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await authService.debugFindUser(email);
      res.json({
        found: !!user,
        user: user ? {
          id: user.id,
          username: user.username,
          user_mail: user.user_mail,
          user_profile: user.user_profile,
          created_at: user.created_at
        } : null
      });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Debug route to check deadline calculation
  app.get("/api/debug/deadline/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("🐛 DEBUG: Verificando deadline para userId:", userId);

      const numericUserId = parseInt(userId.replace('user-', ''));
      const user = await authService.getUserById(numericUserId);

      if (!user) {
        return res.json({
          error: "Usuário não encontrado",
          userId: userId,
          numericUserId: numericUserId
        });
      }

      const userCreationDate = new Date(user.created_at);
      const deadline = new Date(userCreationDate.getTime());
      deadline.setDate(deadline.getDate() + 15);

      const now = new Date();
      const timeDifference = deadline.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.user_mail,
          created_at: user.created_at,
          created_at_iso: userCreationDate.toISOString()
        },
        calculation: {
          userCreationDate: userCreationDate.toISOString(),
          currentDate: now.toISOString(),
          deadline: deadline.toISOString(),
          timeDifference: timeDifference,
          daysRemaining: daysRemaining,
          isExpired: timeDifference <= 0,
          minutesRemaining: Math.ceil(timeDifference / (1000 * 60)),
          hoursRemaining: Math.ceil(timeDifference / (1000 * 60 * 60))
        }
      });
    } catch (error) {
      console.error("Error in debug deadline:", error);
      res.status(500).json({ 
        error: "Erro interno do servidor",
        message: error.message 
      });
    }
  });

  // Admin route to list all users
  app.get("/api/admin/users", async (req, res) => {
    try {
      // Simple check for admin - in production you'd use proper auth middleware
      const users = await authService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin route to update user
  app.put("/api/admin/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email, password, profile } = req.body;

      console.log("🔧 Atualizando usuário:", userId, { username, email, profile });

      if (!username || !email || !profile) {
        return res.status(400).json({ message: "Nome, email e perfil são obrigatórios" });
      }

      if (!["colaborador", "admin"].includes(profile)) {
        return res.status(400).json({ message: "Perfil inválido" });
      }

      const updatedUser = await authService.updateUser(parseInt(userId), {
        username,
        user_mail: email,
        password: password || undefined,
        user_profile: profile,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      console.log("✅ Usuário atualizado com sucesso:", updatedUser.username);

      res.json({
        success: true,
        message: "Usuário atualizado com sucesso",
        user: updatedUser
      });
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Admin route to delete user
  app.delete("/api/admin/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      console.log("🗑️ Excluindo usuário:", userId);

      const deleted = await authService.deleteUser(parseInt(userId));

      if (!deleted) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      console.log("✅ Usuário excluído com sucesso");

      res.json({
        success: true,
        message: "Usuário excluído com sucesso"
      });
    } catch (error) {
      console.error("❌ Erro ao excluir usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get user progress
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getProgress(userId);

      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }

      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create user progress
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.createProgress(progressData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user progress
  app.put("/api/progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      const progress = await storage.updateProgress(userId, updates);

      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }

      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Check daily attempts before evaluation
  app.get("/api/check-attempts/:userId/:moduleId", async (req, res) => {
    try {
      const { userId, moduleId } = req.params;
      console.log("🔍 Verificando tentativas para userId:", userId, "moduleId:", moduleId);
      const result = await storage.checkDailyAttempts(userId, parseInt(moduleId));
      console.log("✅ Resultado da verificação:", result);
      res.json(result);
    } catch (error) {
      console.error("Error checking attempts:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Add new endpoint to handle evaluation attempts check
  app.get("/api/evaluations/attempts", async (req, res) => {
    try {
      const { userId, moduleId } = req.query;

      if (!userId || !moduleId) {
        return res.status(400).json({ 
          message: "userId e moduleId são obrigatórios",
          canAttempt: false 
        });
      }

      console.log("🔍 Verificando tentativas para userId:", userId, "moduleId:", moduleId);
      const result = await storage.checkDailyAttempts(userId.toString(), parseInt(moduleId.toString()));
      console.log("✅ Resultado da verificação:", result);
      res.json(result);
    } catch (error) {
      console.error("Error checking attempts:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        canAttempt: false 
      });
    }
  });

  // Check deadline
  app.get("/api/check-deadline/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await storage.checkAndUpdateDeadline(userId);
      res.json(result);
    } catch (error) {
      console.error("Error checking deadline:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Save module evaluation result
  app.post("/api/evaluations", async (req, res) => {
    try {
      const { userId, moduleId, score, passed, answers, totalQuestions, correctAnswers, timeSpent } = req.body;

      if (!userId || !moduleId || score === undefined || passed === undefined) {
        return res.status(400).json({ message: "userId, moduleId, score e passed são obrigatórios" });
      }

      // Check daily attempts
      const attemptCheck = await storage.checkDailyAttempts(userId.toString(), moduleId);
      if (!attemptCheck.canAttempt) {
        return res.status(429).json({ 
          message: "Limite de tentativas diárias excedido. Tente novamente em 24 horas.",
          remainingTime: attemptCheck.remainingTime,
          ...attemptCheck
        });
      }

      // Salvar na tabela de avaliações detalhadas
      const evaluation = await storage.saveModuleEvaluation({
        userId: userId.toString(),
        moduleId,
        score,
        passed,
        answers: answers || {},
        totalQuestions: totalQuestions || 20,
        correctAnswers: correctAnswers || Math.floor((score / 100) * (totalQuestions || 20)),
        timeSpent: timeSpent || null,
        completedAt: new Date().toISOString()
      });

      // Salvar na tabela avaliacao_user (formato simples)
      const avaliacaoUser = await storage.saveAvaliacaoUser({
        userId: userId,
        passed: passed
      });

      console.log("AVALIAÇÃO REGISTRADA - Usuário:", userId, "Módulo:", moduleId, "Score:", score, "Passou:", passed);

      res.json({
        success: true,
        message: "Avaliação salva com sucesso!",
        data: { evaluation, avaliacaoUser }
      });
    } catch (error) {
      console.error("Error saving evaluation:", error);
      res.status(500).json({ 
        success: false,
        message: "Erro interno do servidor", 
        error: error.message 
      });
    }
  });

  // Generate certificate
  app.post("/api/generate-certificate", async (req, res) => {
    try {
      const { userId, userName } = req.body;

      if (!userId || !userName) {
        return res.status(400).json({ message: "userId e userName são obrigatórios" });
      }

      const certificate = await storage.generateCertificate(userId, userName);

      if (certificate) {
        res.json({
          success: true,
          certificate
        });
      } else {
        res.status(500).json({ message: "Erro ao gerar certificado" });
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Get certificate
  app.get("/api/certificates/:certificateId", async (req, res) => {
    try {
      const { certificateId } = req.params;
      const certificate = await storage.getCertificate(certificateId);

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      res.json(certificate);
    } catch (error) {
      console.error("Error getting certificate:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Achievements routes
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("🏆 Verificando conquistas para usuário:", userId);

      // Verificar e desbloquear novas conquistas
      const newAchievements = await storage.checkAndUnlockAchievements(userId);

      // Buscar todas as conquistas do usuário
      const userAchievements = await storage.getUserAchievements(userId);

      res.json({
        achievements: userAchievements,
        newAchievements: newAchievements,
        success: true
      });
    } catch (error) {
      console.error("❌ Erro ao buscar conquistas:", error);
      res.status(500).json({ 
        error: "Internal server error",
        achievements: [],
        newAchievements: []
      });
    }
  });

  // Get avaliacao history
  app.get("/api/avaliacao/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const avaliacoes = await storage.getAvaliacaoHistory(userId);

      res.json({
        success: true,
        data: avaliacoes
      });
    } catch (error) {
      console.error("Error fetching avaliacoes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Test insert specifically for userId 4
  app.post("/api/test-userid-4", async (req, res) => {
    try {
      console.log("🎯 Testing insert for userId 4...");

      const testData = {
        userId: 4,
        moduleNumber: 1,
        score: 88,
        totalQuestions: 20,
        correctAnswers: 18,
        passed: true,
        answers: { "1": 1, "2": 0, "3": 2 },
        timeSpent: 300
      };

      console.log("🎯 Test data for userId 4:", testData);

      const result = await storage.saveEvaluation(testData);

      console.log("🎯 Insert successful for userId 4:", result);

      res.json({
        success: true,
        message: "Teste com userId 4 realizado com sucesso!",
        userId: 4,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("🎯 Insert failed for userId 4:", error);
      res.status(500).json({
        success: false,
        message: "Falha no teste com userId 4",
        error: error.message,
        stack: error.stack
      });
    }
  });

  // Simple insert test endpoint
  app.post("/api/test-simple-insert", async (req, res) => {
    try {
      console.log("🔧 Testing simple insert...");

      const testData = {
        userId: 4,
        moduleNumber: 1,
        score: 95,
        totalQuestions: 20,
        correctAnswers: 19,
        passed: true,
        answers: { "1": 1, "2": 0, "3": 2, "4": 1 },
        timeSpent: 450
      };

      console.log("🔧 Inserting test data:", testData);

      const result = await storage.saveEvaluation(testData);

      console.log("🔧 Insert successful:", result);

      res.json({
        success: true,
        message: "Inserção realizada com sucesso!",
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("🔧 Insert failed:", error);
      res.status(500).json({
        success: false,
        message: "Falha na inserção",
        error: error.message
      });
    }
  });

  // Test route to insert a simple evaluation record
  app.post("/api/test-insert-evaluation", async (req, res) => {
    try {
      console.log("🧪 Testing direct evaluation insert...");

      const testData = {
        userId: 4, // Using existing user ID
        moduleNumber: 1,
        score: 85,
        totalQuestions: 20,
        correctAnswers: 17,
        passed: true,
        answers: { "1": 1, "2": 0, "3": 2 },
        timeSpent: 300
      };

      console.log("🧪 Test data:", testData);

      const result = await storage.saveEvaluation(testData);

      console.log("🧪 Insert result:", result);

      res.json({
        success: true,
        message: "Test evaluation inserted successfully",
        data: result
      });
    } catch (error) {
      console.error("🧪 Test insert failed:", error);
      res.status(500).json({
        success: false,
        message: "Test insert failed",
        error: error.message,
        stack: error.stack
      });
    }
  });

  // Database validation and simple insert test endpoint
  app.post("/api/validate-db", async (req, res) => {
    try {
      console.log("🔍 Validando conexão com banco de dados...");

      // Test database connection
      const connectionTest = await testSupabaseConnection();
      console.log("🔍 Teste de conexão:", connectionTest);

      if (!connectionTest.success) {
        return res.status(500).json({
          success: false,
          message: "Falha na conexão com o banco",
          connectionTest
        });
      }

      console.log("✅ Conexão validada, testando insert...");

      // Test simple insert - similar to user creation process
      const testEvaluation = {
        userId: 4, // Using existing user ID
        moduleNumber: 1,
        score: 95,
        totalQuestions: 20,
        correctAnswers: 19,
        passed: true,
        answers: { "1": 1, "2": 0, "3": 2, "4": 1, "5": 3 },
        timeSpent: 480
      };

      console.log("🔍 Dados do teste:", testEvaluation);

      const insertResult = await storage.saveEvaluation(testEvaluation);
      console.log("✅ Insert realizado:", insertResult);

      // Also test getting data back
      const evaluationHistory = await storage.getEvaluationHistory("4", 1);
      console.log("🔍 Histórico recuperado:", evaluationHistory.length, "registros");

      res.json({
        success: true,
        message: "Validação completa realizada com sucesso!",
        tests: {
          connection: connectionTest,
          insert: {
            success: true,
            data: insertResult
          },
          retrieve: {
            success: true,
            count: evaluationHistory.length,
            latestRecord: evaluationHistory[0]
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ Erro na validação:", error);
      res.status(500).json({
        success: false,
        message: "Erro na validação do banco",
        error: error.message,
        stack: error.stack
      });
    }
  });

  // Test insert for new avaliacao_user table
  app.post("/api/test-avaliacao", async (req, res) => {
    try {
      console.log("🚀 TESTE AVALIACAO_USER - Inserindo dados...");

      const data = {
        userId: 4, // Usuário existente
        passed: true
      };

      console.log("📊 Dados para inserir na avaliacao_user:", data);

      const result = await storage.saveAvaliacaoUser(data);

      console.log("✅ SUCESSO! Dados inseridos:", result);

      res.json({
        success: true,
        message: "Avaliação inserida na nova tabela!",
        data: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ ERRO no insert:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Endpoint to populate sample progress data
  app.post("/api/populate-progress", async (req, res) => {
    try {
      console.log("📊 Populating sample progress data...");

      // Get all existing users to create progress for them
      const users = await authService.getAllUsers();

      if (users.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Nenhum usuário encontrado. Crie usuários primeiro."
        });
      }

      const progressData = [];

      for (const user of users) {
        // Create sample progress for each user
        const sampleProgress = {
          userId: user.id.toString(),
          currentDay: Math.floor(Math.random() * 5) + 1, // Random day 1-5
          completedDays: [1, 2], // Sample completed days
          dayProgress: {
            "1": 100,
            "2": 100,
            "3": Math.floor(Math.random() * 100), // Random progress
            "4": Math.floor(Math.random() * 50),
            "5": 0
          },
          quizResults: {
            "1": { score: 85, passed: true },
            "2": { score: 92, passed: true },
            "3": { score: 78, passed: true }
          }
        };

        try {
          // Check if progress already exists
          const existingProgress = await storage.getProgress(user.id.toString());

          if (existingProgress) {
            console.log(`📊 Progress already exists for user ${user.id}`);
            progressData.push(existingProgress);
          } else {
            const progress = await storage.createProgress(sampleProgress);
            console.log(`📊 Created progress for user ${user.id}:`, progress);
            progressData.push(progress);
          }
        } catch (error) {
          console.error(`❌ Error creating progress for user ${user.id}:`, error);
        }
      }

      res.json({
        success: true,
        message: `Dados de progresso criados/verificados para ${progressData.length} usuários`,
        data: progressData,
        totalUsers: users.length,
        progressCreated: progressData.length
      });

    } catch (error) {
      console.error("❌ Error populating progress data:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao popular dados de progresso",
        error: error.message
      });
    }
  });

  // Endpoint to populate sample evaluation data
  app.post("/api/populate-evaluations", async (req, res) => {
    try {
      console.log("🎯 Populating sample evaluation data...");

      // Get all existing users
      const users = await authService.getAllUsers();

      if (users.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Nenhum usuário encontrado. Crie usuários primeiro."
        });
      }

      const evaluationData = [];

      for (const user of users) {
        // Create sample evaluations for modules 1-5
        for (let moduleNumber = 1; moduleNumber <= 3; moduleNumber++) {
          const sampleEvaluation = {
            userId: user.id,
            moduleNumber,
            score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
            totalQuestions: 20,
            correctAnswers: Math.floor((Math.floor(Math.random() * 40) + 60) / 5), // Proportional to score
            passed: Math.random() > 0.3, // 70% chance of passing
            answers: {
              "1": Math.floor(Math.random() * 4),
              "2": Math.floor(Math.random() * 4),
              "3": Math.floor(Math.random() * 4),
              "4": Math.floor(Math.random() * 4),
              "5": Math.floor(Math.random() * 4)
            },
            timeSpent: Math.floor(Math.random() * 600) + 300 // 5-15 minutes
          };

          try {
            const evaluation = await storage.saveEvaluation(sampleEvaluation);
            console.log(`🎯 Created evaluation for user ${user.id}, module ${moduleNumber}`);
            evaluationData.push(evaluation);

            // Also create attempt record
            const attemptCount = await storage.getAttemptCount(user.id.toString(), moduleNumber);
            await storage.saveEvaluationAttempt({
              userId: user.id,
              moduleNumber,
              attemptNumber: attemptCount + 1,
              score: sampleEvaluation.score,
              passed: sampleEvaluation.passed
            });

          } catch (error) {
            console.error(`❌ Error creating evaluation for user ${user.id}, module ${moduleNumber}:`, error);
          }
        }
      }

      res.json({
        success: true,
        message: `Dados de avaliação criados para ${evaluationData.length} registros`,
        data: evaluationData,
        totalUsers: users.length,
        evaluationsCreated: evaluationData.length
      });

    } catch (error) {
      console.error("❌ Error populating evaluation data:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao popular dados de avaliação",
        error: error.message
      });
    }
  });

  // Validation routes for checking data
  app.get("/api/admin/all-evaluations", async (req, res) => {
    try {
      const evaluations = await storage.getAllEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching all evaluations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user evaluations for admin panel
  app.get("/api/admin/user-evaluations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("Fetching evaluations for userId:", userId);

      const evaluationData = await storage.getUserEvaluationData(userId);

      console.log("Sending evaluation data:", evaluationData);
      res.json(evaluationData);
    } catch (error) {
      console.error("Error fetching user evaluations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/module-stats/:moduleNumber", async (req, res) => {
    try {
      const { moduleNumber } = req.params;
      const stats = await storage.getModuleStats(parseInt(moduleNumber));

      res.json(stats);
    } catch (error) {
      console.error("Error fetching module stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Manual sync progress endpoint for testing
  app.post("/api/sync-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("🔄 Sincronização manual de progresso para userId:", userId);

      const updatedProgress = await storage.syncProgressWithEvaluations(userId);

      if (updatedProgress) {
        res.json({
          success: true,
          message: "Progresso sincronizado com sucesso",
          progress: updatedProgress
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Não foi possível sincronizar o progresso"
        });
      }
    } catch (error) {
      console.error("❌ Erro na sincronização manual:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message
      });
    }
  });

  // Test endpoint to simulate user completing all modules
  app.post("/api/test-complete-modules/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("🎓 Simulando conclusão de todos os módulos para userId:", userId);

      // Create evaluation records for all modules with passing scores
      for (let moduleId = 1; moduleId <= 4; moduleId++) {
        const evaluationData = {
          userId: parseInt(userId),
          moduleId,
          score: 95, // High score to ensure passing
          passed: true,
          answers: { "1": 1, "2": 0, "3": 2, "4": 1, "5": 3 },
          totalQuestions: 20,
          correctAnswers: 19,
          timeSpent: 300,
          completedAt: new Date().toISOString()
        };

        await storage.saveModuleEvaluation(evaluationData);
        console.log(`✅ Módulo ${moduleId} concluído com sucesso`);
      }

      // Sync progress to update user's status
      const updatedProgress = await storage.syncProgressWithEvaluations(userId);

      res.json({
        success: true,
        message: "Todos os módulos foram simulados como concluídos!",
        progress: updatedProgress,
        certificateReady: true,
        nextStep: "O usuário agora pode gerar seu certificado"
      });

    } catch (error) {
      console.error("❌ Erro ao simular conclusão dos módulos:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao simular conclusão",
        error: error.message
      });
    }
  });

  // Get consecutive days data
  app.get("/api/consecutive-days/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("📅 Calculando dias consecutivos para usuário:", userId);

      const consecutiveDays = await storage.calculateConsecutiveDays(userId);

      res.json({
        success: true,
        consecutiveDays: consecutiveDays
      });
    } catch (error) {
      console.error("❌ Error calculating consecutive days:", error);
      res.status(500).json({ 
        success: false,
        consecutiveDays: 0
      });
    }
  });

  // Get user login history
  app.get("/api/user-logins/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("📅 Buscando histórico de logins para usuário:", userId);

      const logins = await storage.getUserLogins(userId);

      res.json({
        success: true,
        logins: logins,
        totalLogins: logins.length
      });
    } catch (error) {
      console.error("❌ Error fetching user logins:", error);
      res.status(500).json({ 
        success: false,
        logins: [],
        totalLogins: 0
      });
    }
  });

  // Get user achievements
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("🏆 Buscando conquistas para usuário:", userId);

      // Verificar e desbloquear novas conquistas
      const newAchievements = await storage.checkAndUnlockAchievements(userId);

      // Buscar todas as conquistas do usuário
      const userAchievements = await storage.getUserAchievements(userId);

      res.json({
        success: true,
        achievements: userAchievements,
        newAchievements: newAchievements
      });
    } catch (error) {
      console.error("❌ Error fetching achievements:", error);
      res.status(500).json({ 
        success: false,
        message: "Erro ao buscar conquistas" 
      });
    }
  });

  // Complete validation endpoint
  app.get("/api/validate-all-data", async (req, res) => {
    try {
      console.log("🔍 Validating all data in database...");

      // Get all users
      const users = await authService.getAllUsers();

      // Get all progress records
      const allProgress = [];
      for (const user of users) {
        try {
          const progress = await storage.getProgress(user.id.toString());
          if (progress) {
            allProgress.push(progress);
          }
        } catch (error) {
          console.error(`Error getting progress for user ${user.id}:`, error);
        }
      }

      // Get all evaluations
      const allEvaluations = await storage.getAllEvaluations();

      // Get all attempts
      const allAttempts = [];
      for (const user of users) {
        try {
          const attempts = await storage.getUserAllAttempts(user.id.toString());
          allAttempts.push(...attempts);
        } catch (error) {
          console.error(`Error getting attempts for user ${user.id}:`, error);
        }
      }

      res.json({
        success: true,
        message: "Validação completa dos dados",
        summary: {
          totalUsers: users.length,
          totalProgress: allProgress.length,
          totalEvaluations: allEvaluations.length,
          totalAttempts: allAttempts.length
        },
        data: {
          users: users.map(u => ({
            id: u.id,
            username: u.username,
            email: u.user_mail,
            profile: u.user_profile
          })),
          progress: allProgress,
          evaluations: allEvaluations,
          attempts: allAttempts
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ Error validating data:", error);
      res.status(500).json({
        success: false,
        message: "Erro na validação dos dados",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}