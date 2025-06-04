
import { faker } from '@faker-js/faker';

export class QAUtils {
  // Gerar dados de teste
  static generateTestUser() {
    return {
      username: faker.internet.userName(),
      password: 'TestPass123!',
      user_mail: faker.internet.email(),
      user_profile: 'colaborador'
    };
  }

  // Criar usuário com data específica
  static async createUserWithDate(daysAgo = 0) {
    const userData = this.generateTestUser();
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    return {
      ...userData,
      created_at: createdAt.toISOString()
    };
  }

  // Simular respostas de avaliação
  static generateEvaluationAnswers(correctCount = 18, totalQuestions = 20) {
    const answers = {};
    for (let i = 1; i <= totalQuestions; i++) {
      answers[i] = i <= correctCount ? 1 : 0; // Primeiras X corretas
    }
    return answers;
  }

  // Validar estrutura de resposta da API
  static validateAPIResponse(response, expectedFields) {
    const errors = [];
    
    expectedFields.forEach(field => {
      if (!(field in response)) {
        errors.push(`Campo obrigatório '${field}' não encontrado`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Monitorar performance
  static async measureResponseTime(apiCall) {
    const start = Date.now();
    const result = await apiCall();
    const duration = Date.now() - start;
    
    return {
      result,
      duration,
      isAcceptable: duration < 1000 // < 1 segundo
    };
  }

  // Cleanup de dados de teste
  static async cleanupTestData() {
    // Implementar limpeza de dados de teste
    console.log('🧹 Limpando dados de teste...');
  }
}

// Cenários de teste específicos
export const TestScenarios = {
  // Usuário próximo do prazo
  nearDeadline: {
    daysRemaining: 2,
    expectWarning: true
  },

  // Usuário com prazo expirado
  expiredDeadline: {
    daysRemaining: -1,
    expectBlocked: true
  },

  // Usuário com múltiplas tentativas
  multipleAttempts: {
    attempts: 2,
    expectLimited: true
  },

  // Fluxo completo de sucesso
  successFlow: {
    modulesPassed: [1, 2, 3, 4],
    expectCertificate: true
  }
};
