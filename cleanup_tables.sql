
-- Cleanup script para padronizar tabelas de avaliação

-- Remover tabelas desnecessárias se existirem
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS evaluation_attempts;

-- Recriar a tabela module_evaluations com estrutura padronizada
DROP TABLE IF EXISTS module_evaluations CASCADE;

CREATE TABLE module_evaluations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 20,
  correct_answers INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB DEFAULT '{}',
  time_spent INTEGER, -- em segundos
  completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_module_evaluations_user_module ON module_evaluations(user_id, module_id);
CREATE INDEX idx_module_evaluations_completed_at ON module_evaluations(completed_at);

-- Verificar estrutura das tabelas que devem permanecer
SELECT 'Estrutura das tabelas principais:' as status;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('users', 'onboarding_progress', 'avaliacao_user', 'module_evaluations')
ORDER BY table_name, ordinal_position;
