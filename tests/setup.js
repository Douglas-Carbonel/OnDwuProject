
import { beforeAll, afterAll } from 'vitest';
import { QAUtils } from './qa-utils.js';

// Setup global para todos os testes
beforeAll(async () => {
  console.log('🚀 Iniciando setup de testes QA...');
  
  // Verificar se servidor está rodando
  try {
    const response = await fetch('http://localhost:5000/api/health');
    if (!response.ok) {
      throw new Error('Servidor não está respondendo');
    }
  } catch (error) {
    console.error('❌ Servidor não está disponível para testes');
    process.exit(1);
  }

  // Criar dados de teste se necessário
  await setupTestData();
});

afterAll(async () => {
  console.log('🧹 Limpando dados de teste...');
  await QAUtils.cleanupTestData();
});

async function setupTestData() {
  // Criar usuários de teste com diferentes cenários
  const testUsers = [
    await QAUtils.createUserWithDate(1),  // Usuário novo
    await QAUtils.createUserWithDate(13), // Próximo do prazo
    await QAUtils.createUserWithDate(16), // Prazo expirado
  ];

  console.log(`📝 Criados ${testUsers.length} usuários de teste`);
}
