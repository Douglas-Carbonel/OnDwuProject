
describe('Persistência de Dados', () => {
  beforeEach(() => {
    cy.loginAsUser()
  })

  describe('Persistência de Progresso', () => {
    it('deve manter progresso após logout/login', () => {
      // Capturar estado inicial
      cy.get('[data-testid="progress-percentage"]').invoke('text').as('initialProgress')
      
      // Fazer logout
      cy.logout()
      
      // Fazer login novamente
      cy.loginAsUser()
      
      // Verificar se progresso foi mantido
      cy.get('@initialProgress').then((initialProgress) => {
        cy.get('[data-testid="progress-percentage"]').should('contain', initialProgress)
      })
    })

    it('deve manter resultados de avaliações', () => {
      // Verificar se há resultados salvos
      cy.get('[data-testid="module-1"]').click()
      
      cy.get('body').then($body => {
        if ($body.text().includes('Última pontuação')) {
          const score = $body.find('[data-testid="last-score"]').text()
          
          // Fazer logout/login
          cy.logout()
          cy.loginAsUser()
          cy.get('[data-testid="module-1"]').click()
          
          // Verificar se pontuação foi mantida
          cy.get('[data-testid="last-score"]').should('contain', score)
        }
      })
    })
  })

  describe('Sincronização de Estado', () => {
    it('deve sincronizar estado entre abas', () => {
      // Este teste simularia múltiplas abas/sessões
      // Cypress não suporta múltiplas abas nativamente, mas podemos testar via API
      
      cy.request({
        method: 'GET',
        url: '/api/progress/user-2'
      }).then((response) => {
        const currentState = response.body
        
        // Simular mudança em outra "sessão"
        cy.request({
          method: 'PUT',
          url: '/api/progress/user-2',
          body: {
            ...currentState,
            currentModule: currentState.currentModule + 1
          }
        })
        
        // Recarregar página atual
        cy.reload()
        
        // Verificar se mudança foi refletida
        cy.get('[data-testid="current-module"]').should('contain', currentState.currentModule + 1)
      })
    })
  })

  describe('Integridade dos Dados', () => {
    it('deve validar dados antes de salvar', () => {
      // Tentar submeter dados inválidos via API
      cy.request({
        method: 'POST',
        url: '/api/evaluations',
        body: {
          userId: 'invalid',
          moduleId: 'not_a_number',
          score: 'invalid_score'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.not.eq(200)
      })
    })

    it('deve prevenir modificação de created_at', () => {
      // Verificar se o trigger está funcionando
      cy.request({
        method: 'GET',
        url: '/api/debug/user/douglas@dwu.com.br'
      }).then((response) => {
        if (response.body.found) {
          const originalCreatedAt = response.body.user.created_at
          
          // Tentar modificar created_at via update (deve ser prevenido pelo trigger)
          cy.request({
            method: 'PUT',
            url: `/api/admin/users/${response.body.user.id}`,
            body: {
              username: 'Douglas Updated',
              email: 'douglas@dwu.com.br',
              profile: 'colaborador'
            },
            failOnStatusCode: false
          })
          
          // Verificar se created_at não foi alterado
          cy.request({
            method: 'GET',
            url: '/api/debug/user/douglas@dwu.com.br'
          }).then((updatedResponse) => {
            expect(updatedResponse.body.user.created_at).to.eq(originalCreatedAt)
          })
        }
      })
    })
  })
})
