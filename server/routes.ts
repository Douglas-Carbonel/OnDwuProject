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
          user_profile: user.user_profile
        } : null
      });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
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
      const result = await storage.checkDailyAttempts(userId, parseInt(moduleId));
      res.json(result);
    } catch (error) {
      console.error("Error checking attempts:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
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
          remainingTime: attemptCheck.remainingTime
        });
      }

      // Record attempt
      await storage.recordAttempt(userId.toString(), moduleId);

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
        return res.status(404).json({ message: "Certificado não encontrado" });
      }

      // Generate certificate HTML
      const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificado de Conclusão - DWU IT Solutions</title>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .certificate { max-width: 800px; margin: 0 auto; background: white; padding: 60px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: bold; color: #667eea; margin-bottom: 10px; }
            .title { font-size: 28px; color: #333; margin-bottom: 30px; }
            .content { text-align: center; line-height: 2; }
            .name { font-size: 32px; font-weight: bold; color: #667eea; margin: 20px 0; }
            .course { font-size: 20px; color: #555; margin: 20px 0; }
            .date { font-size: 16px; color: #777; margin-top: 40px; }
            .certificate-id { font-size: 12px; color: #999; margin-top: 20px; }
            .signature { margin-top: 60px; display: flex; justify-content: space-around; }
            .signature-line { width: 200px; border-top: 2px solid #333; padding-top: 10px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="logo">DWU IT Solutions</div>
              <div class="title">CERTIFICADO DE CONCLUSÃO</div>
            </div>
            <div class="content">
              <p>Certificamos que</p>
              <div class="name">${certificate.user_name}</div>
              <p>concluiu com êxito o</p>
              <div class="course">${certificate.course_name}</div>
              <p>demonstrando conhecimento e dedicação no programa de capacitação da equipe de suporte técnico.</p>
              <div class="date">Concluído em: ${new Date(certificate.completion_date).toLocaleDateString('pt-BR')}</div>
              <div class="certificate-id">Certificado ID: ${certificate.certificate_id}</div>
            </div>
            <div class="signature">
              <div class="signature-line">
                <div>Diretor de Treinamento</div>
                <div>DWU IT Solutions</div>
              </div>
              <div class="signature-line">
                <div>Coordenador Técnico</div>
                <div>DWU IT Solutions</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      res.send(certificateHTML);
    } catch (error) {
      console.error("Error getting certificate:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
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