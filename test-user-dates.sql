
-- Script para criar usuários de teste com datas diferentes
-- Execute no SQL Editor do Supabase para testar

-- Usuário criado há 5 dias (deveria mostrar ~10 dias restantes)
INSERT INTO users (username, password, user_mail, user_profile, created_at)
VALUES (
  'Teste 5 dias',
  '$2b$10$test.hash.for.testing',
  'teste5dias@dwu.com.br',
  'colaborador',
  NOW() - INTERVAL '5 days'
);

-- Usuário criado há 10 dias (deveria mostrar ~5 dias restantes)
INSERT INTO users (username, password, user_mail, user_profile, created_at)
VALUES (
  'Teste 10 dias',
  '$2b$10$test.hash.for.testing',
  'teste10dias@dwu.com.br',
  'colaborador',
  NOW() - INTERVAL '10 days'
);

-- Usuário criado há 16 dias (deveria estar expirado)
INSERT INTO users (username, password, user_mail, user_profile, created_at)
VALUES (
  'Teste Expirado',
  '$2b$10$test.hash.for.testing',
  'testeexpirado@dwu.com.br',
  'colaborador',
  NOW() - INTERVAL '16 days'
);
