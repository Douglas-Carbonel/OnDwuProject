
-- Adicionar novos campos na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Adicionar novos campos na tabela onboarding_progress
ALTER TABLE onboarding_progress 
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_expired BOOLEAN DEFAULT FALSE;

-- Criar tabela para controle de tentativas diárias
CREATE TABLE IF NOT EXISTS daily_attempts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  attempt_date TIMESTAMP DEFAULT NOW(),
  attempt_count INTEGER DEFAULT 1
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_daily_attempts_user_module_date 
ON daily_attempts(user_id, module_id, attempt_date);

-- Criar tabela para certificados
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  certificate_id TEXT NOT NULL UNIQUE,
  user_name TEXT NOT NULL,
  course_name TEXT NOT NULL DEFAULT 'Programa de Onboarding DWU IT Solutions',
  completion_date TIMESTAMP NOT NULL,
  certificate_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para o certificate_id
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id 
ON certificates(certificate_id);

-- Criar índice para user_id
CREATE INDEX IF NOT EXISTS idx_certificates_user_id 
ON certificates(user_id);
