
-- Criar tabela para registrar logins dos usuários
CREATE TABLE IF NOT EXISTS user_logins (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  login_date TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON user_logins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logins_login_date ON user_logins(login_date);
CREATE INDEX IF NOT EXISTS idx_user_logins_user_date ON user_logins(user_id, login_date);

-- Adicionar comentários para documentação
COMMENT ON TABLE user_logins IS 'Registra cada login do usuário para cálculo de dias consecutivos';
COMMENT ON COLUMN user_logins.user_id IS 'ID do usuário (referencia users.id)';
COMMENT ON COLUMN user_logins.login_date IS 'Data e hora do login';
COMMENT ON COLUMN user_logins.ip_address IS 'Endereço IP do usuário (opcional)';
COMMENT ON COLUMN user_logins.user_agent IS 'User Agent do navegador (opcional)';

-- Verificar se a tabela foi criada
SELECT 
  'Tabela user_logins criada com sucesso!' as status,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'user_logins') as table_exists;
