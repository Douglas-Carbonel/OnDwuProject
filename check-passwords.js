
const bcrypt = require('bcrypt');

// Senhas mais comuns que provavelmente foram usadas
const commonPasswords = [
  '123456',
  'password',
  'admin',
  'dwu123',
  'douglas',
  'yasmim',
  'colaborador',
  'senha123',
  'teste',
  '123',
  'dwu',
  'onboarding'
];

// Hash do Douglas (exemplo do banco): $2b$10$test.hash.for.testing
// Vamos tentar descobrir a senha original

async function checkPasswords() {
  console.log('🔍 Verificando senhas possíveis...\n');
  
  // Para usuários de teste criados pelo script
  const testHash = '$2b$10$test.hash.for.testing';
  console.log('❌ Hash de teste detectado (não é válido):', testHash);
  
  // Gerar novos hashes para senhas comuns
  console.log('\n📝 Senhas sugeridas para os usuários:');
  console.log('=====================================');
  
  for (const password of commonPasswords) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Senha: "${password}" -> Hash: ${hash}`);
  }
  
  console.log('\n💡 Senhas mais prováveis para os usuários:');
  console.log('- Douglas: "douglas" ou "123456"');
  console.log('- Yasmim: "yasmim" ou "123456"');
  console.log('- Teste: "teste" ou "senha123"');
  
  console.log('\n🔧 Para resetar senhas, use estas opções:');
  console.log('1. "123456" (mais comum)');
  console.log('2. "senha123" (padrão brasileiro)');
  console.log('3. Nome do usuário (douglas, yasmim)');
}

checkPasswords().catch(console.error);
