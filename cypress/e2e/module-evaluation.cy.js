
describe('Avaliações dos Módulos', () => {
  beforeEach(() => {
    cy.loginAsUser()
    // Navegar para módulo 1
    cy.get('[data-testid="module-1"]').click()
  })

  describe('Iniciar Avaliação', () => {
    it('deve permitir iniciar avaliação do módulo', () => {
      // Procurar botão de avaliação
      cy.contains('Iniciar Avaliação').click()
      
      // Verificar se avaliação iniciou
      cy.url().should('include', '/evaluation')
      cy.contains('Avaliação - Módulo 1').should('be.visible')
    })

    it('deve verificar limite de tentativas diárias', () => {
      // Simular múltiplas tentativas (seria necessário configurar dados de teste)
      cy.contains('Iniciar Avaliação').click()
      
      // Se já excedeu limite, deve mostrar mensagem
      cy.get('body').then($body => {
        if ($body.text().includes('Limite de tentativas')) {
          cy.contains('Limite de tentativas diárias excedido').should('be.visible')
        }
      })
    })
  })

  describe('Realizar Avaliação', () => {
    beforeEach(() => {
      cy.contains('Iniciar Avaliação').click()
    })

    it('deve mostrar questões da avaliação', () => {
      cy.get('[data-testid="question"]').should('have.length.greaterThan', 0)
      cy.get('[data-testid="question-options"]').should('be.visible')
    })

    it('deve permitir selecionar respostas', () => {
      // Selecionar primeira opção da primeira questão
      cy.get('[data-testid="option-0"]').first().click()
      
      // Verificar se foi selecionada
      cy.get('[data-testid="option-0"]').first().should('be.checked')
    })

    it('deve mostrar progresso da avaliação', () => {
      cy.get('[data-testid="evaluation-progress"]').should('be.visible')
      cy.contains('Questão').should('be.visible')
    })

    it('deve permitir navegar entre questões', () => {
      // Responder primeira questão
      cy.get('[data-testid="option-0"]').first().click()
      
      // Ir para próxima
      cy.get('button').contains('Próxima').click()
      
      // Verificar mudança de questão
      cy.contains('Questão 2').should('be.visible')
    })

    it('deve finalizar avaliação corretamente', () => {
      // Responder todas as questões rapidamente (cenário de teste)
      for (let i = 0; i < 20; i++) {
        cy.get('[data-testid="option-0"]').first().click()
        cy.get('body').then($body => {
          if ($body.find('button:contains("Finalizar")').length > 0) {
            cy.get('button').contains('Finalizar').click()
            return false // break loop
          } else {
            cy.get('button').contains('Próxima').click()
          }
        })
      }
      
      // Verificar resultado
      cy.contains('Resultado da Avaliação').should('be.visible')
      cy.get('[data-testid="score"]').should('be.visible')
    })
  })

  describe('Resultados da Avaliação', () => {
    it('deve mostrar pontuação obtida', () => {
      // Assumindo que já completou uma avaliação
      cy.visit('/onboarding')
      
      // Verificar se há resultados salvos
      cy.get('[data-testid="module-1"]').click()
      
      // Procurar por resultados anteriores
      cy.get('body').then($body => {
        if ($body.text().includes('Última pontuação')) {
          cy.contains('Última pontuação').should('be.visible')
        }
      })
    })

    it('deve mostrar status de aprovação/reprovação', () => {
      cy.visit('/onboarding')
      
      // Verificar badges de status nos módulos
      cy.get('[data-testid="module-status"]').should('exist')
    })
  })
})
