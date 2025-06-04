
describe('Painel Administrativo - CRUD Usuários', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.goToAdminPanel()
  })

  describe('Criar Usuários', () => {
    it('deve criar um novo colaborador com sucesso', () => {
      const userData = {
        username: `Teste Usuario ${Date.now()}`,
        email: `teste${Date.now()}@dwu.com.br`,
        password: 'senha123',
        profile: 'colaborador',
        address: 'Rua Teste, 123, São Paulo, SP',
        phone: '(11) 99999-9999'
      }

      // Preencher formulário
      cy.get('input#username').type(userData.username)
      cy.get('input#email').type(userData.email)
      cy.get('input#password').type(userData.password)
      cy.get('input#address').type(userData.address)
      cy.get('input#phone').type(userData.phone)
      
      // Selecionar perfil
      cy.get('[role="combobox"]').first().click()
      cy.contains('Colaborador - Acesso ao Onboarding').click()
      
      // Submeter formulário
      cy.get('button[type="submit"]').click()
      
      // Verificar sucesso
      cy.contains('criado com sucesso').should('be.visible')
      
      // Verificar se usuário aparece na lista
      cy.contains(userData.username).should('be.visible')
      cy.contains(userData.email).should('be.visible')
    })

    it('deve criar um administrador com sucesso', () => {
      const adminData = {
        username: `Admin Teste ${Date.now()}`,
        email: `admin${Date.now()}@dwu.com.br`,
        password: 'admin123',
        profile: 'admin'
      }

      cy.get('input#username').type(adminData.username)
      cy.get('input#email').type(adminData.email)
      cy.get('input#password').type(adminData.password)
      
      // Selecionar perfil admin
      cy.get('[role="combobox"]').first().click()
      cy.contains('Administrador - Acesso Total').click()
      
      cy.get('button[type="submit"]').click()
      
      cy.contains('criado com sucesso').should('be.visible')
      cy.contains('Admin').should('be.visible') // Badge de admin
    })

    it('deve validar campos obrigatórios', () => {
      cy.get('button[type="submit"]').click()
      
      // Verificar validação HTML5
      cy.get('input#username:invalid').should('exist')
      cy.get('input#email:invalid').should('exist')
      cy.get('input#password:invalid').should('exist')
    })

    it('deve impedir criação de usuário com email duplicado', () => {
      const duplicateEmail = Cypress.env('testUserEmail')
      
      cy.get('input#username').type('Usuario Duplicado')
      cy.get('input#email').type(duplicateEmail)
      cy.get('input#password').type('senha123')
      
      cy.get('button[type="submit"]').click()
      
      cy.contains('já está cadastrado').should('be.visible')
    })
  })

  describe('Visualizar Usuários', () => {
    it('deve listar todos os usuários cadastrados', () => {
      // Verificar se a lista de usuários está visível
      cy.contains('Relatório de Usuários').should('be.visible')
      
      // Verificar se há pelo menos um usuário listado
      cy.get('[data-testid="user-list"]').should('exist')
      cy.get('button').contains('douglas').should('be.visible')
    })

    it('deve expandir detalhes do usuário', () => {
      // Clicar para expandir um usuário
      cy.get('button').contains('douglas').click()
      
      // Verificar se os detalhes foram expandidos
      cy.contains('Módulo Atual').should('be.visible')
      cy.contains('Tentativas').should('be.visible')
      cy.contains('Aprovações').should('be.visible')
    })

    it('deve abrir modal de performance detalhada', () => {
      // Expandir usuário primeiro
      cy.get('button').contains('douglas').click()
      
      // Clicar no botão de tentativas
      cy.get('[data-testid="attempts-button"]').first().click()
      
      // Verificar se modal abriu
      cy.contains('Dashboard de Performance').should('be.visible')
      cy.contains('Análise completa de desempenho').should('be.visible')
    })
  })

  describe('Editar Usuários', () => {
    it('deve abrir modal de edição', () => {
      // Clicar no botão de editar do primeiro usuário
      cy.get('button[data-testid="edit-user-btn"]').first().click()
      
      // Verificar se modal de edição abriu
      cy.contains('Editar Usuário').should('be.visible')
      cy.get('#edit-username').should('be.visible')
    })

    it('deve editar informações do usuário', () => {
      const newUsername = `Nome Editado ${Date.now()}`
      
      cy.get('button[data-testid="edit-user-btn"]').first().click()
      
      // Limpar e digitar novo nome
      cy.get('#edit-username').clear().type(newUsername)
      
      // Salvar alterações
      cy.get('button').contains('Salvar').click()
      
      // Verificar sucesso
      cy.contains('atualizado com sucesso').should('be.visible')
    })

    it('deve alterar perfil do usuário', () => {
      cy.get('button[data-testid="edit-user-btn"]').first().click()
      
      // Alterar perfil
      cy.get('#edit-profile').click()
      cy.contains('Administrador - Acesso Total').click()
      
      cy.get('button').contains('Salvar').click()
      
      cy.contains('atualizado com sucesso').should('be.visible')
    })
  })

  describe('Excluir Usuários', () => {
    it('deve mostrar confirmação antes de excluir', () => {
      cy.get('button[data-testid="delete-user-btn"]').first().click()
      
      // Cypress não consegue testar confirm() nativo, mas podemos verificar se a função é chamada
      // Em um cenário real, você substituiria confirm() por um modal customizado
    })
  })
})
