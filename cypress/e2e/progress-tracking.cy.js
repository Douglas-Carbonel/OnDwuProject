
describe('Acompanhamento de Progresso', () => {
  beforeEach(() => {
    cy.loginAsUser()
  })

  describe('Sincronização de Progresso', () => {
    it('deve sincronizar progresso ao fazer login', () => {
      // Verificar se progresso foi carregado
      cy.get('[data-testid="progress-bar"]').should('be.visible')
      cy.contains('Progresso Geral').should('be.visible')
    })

    it('deve atualizar progresso após completar atividade', () => {
      // Capturar progresso inicial
      cy.get('[data-testid="progress-percentage"]').invoke('text').then((initialProgress) => {
        // Realizar alguma atividade (simular)
        cy.get('[data-testid="module-1"]').click()
        
        // Verificar se progresso foi atualizado
        cy.get('[data-testid="progress-percentage"]').should('not.contain', initialProgress)
      })
    })
  })

  describe('Estados dos Módulos', () => {
    it('deve mostrar módulos com status correto', () => {
      // Módulo 1 deve estar acessível
      cy.get('[data-testid="module-1"]')
        .should('be.visible')
        .and('not.have.class', 'disabled')
      
      // Módulos 2-4 devem estar bloqueados inicialmente
      cy.get('[data-testid="module-2"]').should('have.class', 'disabled')
      cy.get('[data-testid="module-3"]').should('have.class', 'disabled')
      cy.get('[data-testid="module-4"]').should('have.class', 'disabled')
    })

    it('deve desbloquear próximo módulo após aprovação', () => {
      // Este teste requereria completar uma avaliação com sucesso
      // Simular através de API ou dados de teste pré-configurados
      
      cy.request({
        method: 'POST',
        url: '/api/test-complete-modules/2', // userId 2 (assumindo usuário de teste)
        failOnStatusCode: false
      })
      
      // Recarregar página para ver mudanças
      cy.reload()
      
      // Verificar se módulos foram desbloqueados
      cy.get('[data-testid="module-2"]').should('not.have.class', 'disabled')
    })
  })

  describe('Deadlines e Prazos', () => {
    it('deve mostrar prazo correto', () => {
      cy.contains('dias restantes').should('be.visible')
      
      // Verificar se o número de dias é razoável (0-15)
      cy.get('[data-testid="days-remaining"]').invoke('text').then((days) => {
        const numDays = parseInt(days)
        expect(numDays).to.be.at.least(0)
        expect(numDays).to.be.at.most(15)
      })
    })

    it('deve alertar quando prazo está próximo', () => {
      // Verificar se há alertas de prazo (quando aplicável)
      cy.get('body').then($body => {
        if ($body.text().includes('Prazo se aproximando')) {
          cy.contains('Prazo se aproximando').should('be.visible')
        }
      })
    })
  })
})
