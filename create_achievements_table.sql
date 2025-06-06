
-- Criar tabela de conquistas dos usuários
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Inserir conquistas para o usuário Pedro (ID 4) baseado no progresso atual
INSERT INTO user_achievements (user_id, achievement_id) 
SELECT '4', 'first_module'
WHERE NOT EXISTS (
  SELECT 1 FROM user_achievements 
  WHERE user_id = '4' AND achievement_id = 'first_module'
);

-- Verificar se existem pontuações perfeitas para Pedro
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM module_evaluations 
    WHERE user_id = '4' AND score = 100
  ) THEN
    INSERT INTO user_achievements (user_id, achievement_id) 
    SELECT '4', 'perfectionist'
    WHERE NOT EXISTS (
      SELECT 1 FROM user_achievements 
      WHERE user_id = '4' AND achievement_id = 'perfectionist'
    );
  END IF;
END $$;

-- Verificar conquistas criadas
SELECT 
  ua.user_id,
  ua.achievement_id,
  ua.unlocked_at,
  u.username
FROM user_achievements ua
JOIN users u ON u.id::text = ua.user_id
ORDER BY ua.unlocked_at DESC;
