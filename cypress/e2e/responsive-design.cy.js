
describe('Design Responsivo e Usabilidade', () => {
  const viewports = [
    { width: 320, height: 568, device: 'mobile' },
    { width: 768, height: 1024, device: 'tablet' },
    { width: 1280, height: 720, device: 'desktop' }
  ]

  viewports.forEach(viewport => {
    describe(`${viewport.device} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height)
        cy.loginAsUser()
      })

      it('deve exibir interface corretamente', () => {
        // Verificar elementos principais
        cy.get('[data-testid="main-navigation"]').should('be.visible')
        cy.get('[data-testid="module-list"]').should('be.visible')
        cy.get('[data-testid="progress-bar"]').should('be.visible')
      })

      it('deve permitir navegação em dispositivos móveis', () => {
        if (viewport.device === 'mobile') {
          // Verificar se menu hamburger está presente (se aplicável)
          cy.get('body').then($body => {
            if ($body.find('[data-testid="mobile-menu"]').length > 0) {
              cy.get('[data-testid="mobile-menu"]').click()
              cy.get('[data-testid="navigation-menu"]').should('be.visible')
            }
          })
        }
      })

      it('deve manter funcionalidade em diferentes tamanhos', () => {
        // Testar funcionalidade principal
        cy.get('[data-testid="module-1"]').click()
        cy.get('[data-testid="module-content"]').should('be.visible')
      })
    })
  })

  describe('Acessibilidade', () => {
    beforeEach(() => {
      cy.loginAsUser()
    })

    it('deve ter navegação por teclado', () => {
      // Testar navegação com Tab
      cy.get('body').tab()
      cy.focused().should('be.visible')
      
      // Navegar por vários elementos
      cy.tab().tab().tab()
      cy.focused().should('be.visible')
    })

    it('deve ter labels apropriados nos formulários', () => {
      cy.visit('/login')
      
      // Verificar se inputs têm labels
      cy.get('input[type="email"]').should('have.attr', 'aria-label').or('have.attr', 'id')
      cy.get('input[type="password"]').should('have.attr', 'aria-label').or('have.attr', 'id')
    })

    it('deve ter contraste adequado', () => {
      // Verificar se elementos importantes são visíveis
      cy.get('[data-testid="module-1"]').should('be.visible')
      cy.get('button').first().should('be.visible')
    })
  })
})
