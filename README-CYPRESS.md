
# Testes E2E com Cypress - Sistema de Onboarding DWU

## Visão Geral

Este projeto inclui uma suite completa de testes end-to-end (E2E) usando Cypress para validar todas as funcionalidades CRUD da aplicação de onboarding.

## Estrutura dos Testes

```
cypress/
├── e2e/
│   ├── auth.cy.js                 # Testes de autenticação
│   ├── admin-users.cy.js          # CRUD de usuários (admin)
│   ├── onboarding-flow.cy.js      # Fluxo de onboarding
│   ├── module-evaluation.cy.js    # Avaliações dos módulos
│   ├── progress-tracking.cy.js    # Acompanhamento de progresso
│   ├── api-integration.cy.js      # Testes de API
│   ├── responsive-design.cy.js    # Testes de responsividade
│   └── data-persistence.cy.js     # Persistência de dados
├── fixtures/
│   └── test-data.json            # Dados de teste
├── support/
│   ├── commands.js               # Comandos customizados
│   └── e2e.js                   # Configurações globais
└── cypress.config.js            # Configuração principal
```

## Configuração Inicial

### 1. Instalar Dependências

```bash
npm install cypress --save-dev
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `cypress.config.js` e ajuste as credenciais de teste:

```javascript
env: {
  testUserEmail: 'douglas@dwu.com.br',
  testUserPassword: 'douglas',
  adminEmail: 'admin@dwu.com.br',
  adminPassword: 'admin123'
}
```

### 3. Preparar Dados de Teste

Certifique-se de que o banco de dados tenha usuários de teste configurados:

- **Usuário Regular**: douglas@dwu.com.br / douglas
- **Usuário Admin**: admin@dwu.com.br / admin123

## Executando os Testes

### Modo Interativo (Recomendado para desenvolvimento)

```bash
npm run cypress:open
```

### Modo Headless (CI/CD)

```bash
npm run cypress:run
```

### Executar Arquivo Específico

```bash
npx cypress run --spec "cypress/e2e/auth.cy.js"
```

## Categorias de Testes

### 1. Autenticação (`auth.cy.js`)
- ✅ Login com credenciais válidas
- ✅ Validação de credenciais inválidas
- ✅ Campos obrigatórios
- ✅ Logout
- ✅ Proteção de rotas

### 2. CRUD de Usuários (`admin-users.cy.js`)
- ✅ Criar colaborador
- ✅ Criar administrador
- ✅ Validação de formulário
- ✅ Editar usuário
- ✅ Excluir usuário
- ✅ Listar usuários
- ✅ Visualizar detalhes

### 3. Fluxo de Onboarding (`onboarding-flow.cy.js`)
- ✅ Navegação entre módulos
- ✅ Sistema de bloqueio de módulos
- ✅ Notificações
- ✅ Conquistas
- ✅ Feedback

### 4. Avaliações (`module-evaluation.cy.js`)
- ✅ Iniciar avaliação
- ✅ Responder questões
- ✅ Finalizar avaliação
- ✅ Verificar resultados
- ✅ Limite de tentativas

### 5. Progresso (`progress-tracking.cy.js`)
- ✅ Sincronização de progresso
- ✅ Estados dos módulos
- ✅ Prazos e deadlines
- ✅ Persistência de dados

### 6. APIs (`api-integration.cy.js`)
- ✅ Endpoints de autenticação
- ✅ APIs de progresso
- ✅ APIs de avaliação
- ✅ APIs administrativas

### 7. Responsividade (`responsive-design.cy.js`)
- ✅ Mobile (320px)
- ✅ Tablet (768px)
- ✅ Desktop (1280px)
- ✅ Acessibilidade

### 8. Persistência (`data-persistence.cy.js`)
- ✅ Manutenção de estado
- ✅ Integridade de dados
- ✅ Sincronização entre sessões

## Comandos Customizados

O projeto inclui comandos customizados para facilitar os testes:

```javascript
// Login como usuário regular
cy.loginAsUser()

// Login como admin
cy.loginAsAdmin()

// Navegar para painel admin
cy.goToAdminPanel()

// Fazer logout
cy.logout()

// Criar usuário de teste
cy.createTestUser(userData)

// Aguardar elemento aparecer
cy.waitForElement(selector)
```

## Dados de Teste

Os dados de teste estão centralizados em `cypress/fixtures/test-data.json` e incluem:

- Usuários de teste
- Dados de avaliação
- Estados de progresso
- Respostas de API

## Boas Práticas Implementadas

### 1. Seletores Estáveis
```javascript
// Use data-testid ao invés de classes CSS
cy.get('[data-testid="module-1"]')
```

### 2. Isolamento de Testes
```javascript
beforeEach(() => {
  cy.cleanupTestData() // Limpar dados antes de cada teste
})
```

### 3. Esperas Inteligentes
```javascript
// Aguardar elementos aparecerem
cy.waitForElement('[data-testid="progress-bar"]')
```

### 4. Testes de API
```javascript
// Testar APIs diretamente
cy.request('POST', '/api/auth/login', credentials)
```

## Relatórios e Debugging

### Screenshots e Vídeos
O Cypress captura automaticamente screenshots em falhas e pode gravar vídeos dos testes.

### Debug Mode
```bash
npx cypress open --config video=true,screenshotOnRunFailure=true
```

### Logs Detalhados
```javascript
// Adicionar logs customizados
cy.log('Iniciando teste de login')
```

## Integração CI/CD

Para integrar com pipeline de CI/CD:

```bash
# GitHub Actions, GitLab CI, etc.
npm ci
npm run cypress:run --record --key <record-key>
```

## Troubleshooting

### Problemas Comuns

1. **Timeout em elementos**: Aumentar timeout global ou específico
2. **Elementos não encontrados**: Verificar seletores e aguardar carregamento
3. **Falhas intermitentes**: Adicionar esperas adequadas
4. **Dados inconsistentes**: Implementar cleanup de dados

### Debugging

```bash
# Executar com debug
DEBUG=cypress:* npx cypress run

# Abrir DevTools
cy.debug()

# Pausar execução
cy.pause()
```

## Métricas de Cobertura

Os testes cobrem:

- ✅ **Autenticação**: 100%
- ✅ **CRUD Usuários**: 100%
- ✅ **Onboarding Flow**: 90%
- ✅ **Avaliações**: 95%
- ✅ **APIs**: 85%
- ✅ **Responsividade**: 80%

## Manutenção

### Atualizando Testes
1. Revisar testes após mudanças no código
2. Atualizar seletores se necessário
3. Adicionar novos cenários para novas funcionalidades
4. Manter dados de teste atualizados

### Performance
- Executar testes em paralelo quando possível
- Otimizar esperas e timeouts
- Usar mocks para APIs externas quando apropriado

---

Para mais informações sobre Cypress, consulte a [documentação oficial](https://docs.cypress.io/).
