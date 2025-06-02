
-- SQL para criar estrutura no Supabase
-- Execute este script no SQL Editor do Supabase

-- Primeiro, crie a tabela users se não existir
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  user_mail TEXT NOT NULL UNIQUE,
  user_profile TEXT NOT NULL DEFAULT 'colaborador',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crie a tabela progress se não existir
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "currentDay" INTEGER DEFAULT 1,
  "completedDays" JSONB DEFAULT '[]'::jsonb,
  "dayProgress" JSONB DEFAULT '{}'::jsonb,
  "quizResults" JSONB DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Criar a nova tabela avaliacao_user
CREATE TABLE IF NOT EXISTS avaliacao_user (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  passed BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Remover tabelas antigas se existirem
DROP TABLE IF EXISTS evaluation_attempts;
DROP TABLE IF EXISTS evaluations;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_avaliacao_user_userId ON avaliacao_user("userId");
CREATE INDEX IF NOT EXISTS idx_avaliacao_user_createdAt ON avaliacao_user("createdAt");
CREATE INDEX IF NOT EXISTS idx_users_email ON users(user_mail);

-- Inserir um usuário de teste se não existir
INSERT INTO users (username, password, user_mail, user_profile)
SELECT 'teste', 'senha123', 'teste@email.com', 'colaborador'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE user_mail = 'teste@email.com'
);

-- Verificar se as tabelas foram criadas
SELECT 
  'Tabelas criadas com sucesso!' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'users') as users_table,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'progress') as progress_table,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'avaliacao_user') as avaliacao_table;
