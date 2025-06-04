
describe('Autenticação', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Login', () => {
    it('deve permitir login com credenciais válidas', () => {
      cy.visit('/login')
      
      // Preencher formulário de login
      cy.get('input[type="email"]').type(Cypress.env('testUserEmail'))
      cy.get('input[type="password"]').type(Cypress.env('testUserPassword'))
      
      // Submeter formulário
      cy.get('button[type="submit"]').click()
      
      // Verificar redirecionamento para onboarding
      cy.url().should('include', '/onboarding')
      cy.contains('Portal DWU').should('be.visible')
    })

    it('deve mostrar erro com credenciais inválidas', () => {
      cy.visit('/login')
      
      cy.get('input[type="email"]').type('email@invalido.com')
      cy.get('input[type="password"]').type('senhaerrada')
      cy.get('button[type="submit"]').click()
      
      // Verificar mensagem de erro
      cy.contains('Email ou senha incorretos').should('be.visible')
      cy.url().should('include', '/login')
    })

    it('deve validar campos obrigatórios', () => {
      cy.visit('/login')
      
      // Tentar submeter sem preencher
      cy.get('button[type="submit"]').click()
      
      // HTML5 validation deve impedir submit
      cy.get('input[type="email"]:invalid').should('exist')
    })
  })

  describe('Logout', () => {
    it('deve fazer logout corretamente', () => {
      cy.loginAsUser()
      
      // Fazer logout
      cy.get('button').contains('Sair').click()
      
      // Verificar redirecionamento
      cy.url().should('include', '/welcome')
    })
  })

  describe('Acesso a rotas protegidas', () => {
    it('deve redirecionar usuário não autenticado para welcome', () => {
      cy.visit('/onboarding')
      cy.url().should('include', '/welcome')
    })

    it('deve redirecionar usuário não autenticado do admin para welcome', () => {
      cy.visit('/admin')
      cy.url().should('include', '/welcome')
    })
  })
})
