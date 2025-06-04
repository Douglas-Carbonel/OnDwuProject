
describe('Fluxo de Onboarding', () => {
  beforeEach(() => {
    cy.loginAsUser()
  })

  describe('Navegação entre módulos', () => {
    it('deve mostrar módulo 1 como ativo inicialmente', () => {
      cy.contains('Módulo 1').should('be.visible')
      cy.get('[data-testid="module-1"]').should('have.class', 'active') // assumindo classe CSS
      
      // Verificar que módulos 2-4 estão bloqueados
      cy.get('[data-testid="module-2"]').should('contain', 'Bloqueado')
      cy.get('[data-testid="module-3"]').should('contain', 'Bloqueado')
      cy.get('[data-testid="module-4"]').should('contain', 'Bloqueado')
    })

    it('deve permitir acesso ao conteúdo do módulo 1', () => {
      cy.get('[data-testid="module-1"]').click()
      
      // Verificar se o conteúdo do módulo carregou
      cy.contains('Módulo 1').should('be.visible')
      cy.get('[data-testid="module-content"]').should('be.visible')
    })

    it('deve impedir acesso a módulos bloqueados', () => {
      cy.get('[data-testid="module-2"]').should('be.disabled')
      cy.get('[data-testid="module-3"]').should('be.disabled')
      cy.get('[data-testid="module-4"]').should('be.disabled')
    })
  })

  describe('Sistema de notificações', () => {
    it('deve mostrar prazo restante', () => {
      cy.contains('Prazo de conclusão').should('be.visible')
      cy.contains('dias restantes').should('be.visible')
    })

    it('deve mostrar notificações do sistema', () => {
      cy.get('[data-testid="notifications"]').should('be.visible')
      cy.contains('Notificações').should('be.visible')
    })
  })

  describe('Sistema de conquistas', () => {
    it('deve mostrar progresso de conquistas', () => {
      cy.get('[data-testid="achievements"]').should('be.visible')
      cy.contains('Conquistas').should('be.visible')
    })
  })

  describe('Sistema de feedback', () => {
    it('deve mostrar opções de feedback', () => {
      cy.get('[data-testid="feedback-system"]').should('be.visible')
      cy.contains('Feedback').should('be.visible')
    })
  })
})
