
-- Script para proteger o campo created_at da tabela users
-- Execute no SQL Editor do Supabase

-- Criar uma função que previne alteração do created_at
CREATE OR REPLACE FUNCTION prevent_created_at_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Se está tentando alterar created_at, mantenha o valor antigo
  IF OLD.created_at IS DISTINCT FROM NEW.created_at THEN
    NEW.created_at = OLD.created_at;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para proteger o campo created_at
DROP TRIGGER IF EXISTS protect_users_created_at ON users;
CREATE TRIGGER protect_users_created_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_created_at_update();

-- Verificar se o trigger foi criado
SELECT 
  'Trigger criado com sucesso!' as status,
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'protect_users_created_at';
