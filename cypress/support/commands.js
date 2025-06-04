
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para login como usuário regular
Cypress.Commands.add('loginAsUser', (email = Cypress.env('testUserEmail'), password = Cypress.env('testUserPassword')) => {
  cy.visit('/login')
  cy.get('input[type="email"]').clear().type(email)
  cy.get('input[type="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/onboarding')
  cy.wait(2000) // Aguardar carregamento do progresso
})

// Comando para login como admin
Cypress.Commands.add('loginAsAdmin', (email = Cypress.env('adminEmail'), password = Cypress.env('adminPassword')) => {
  cy.visit('/login')
  cy.get('input[type="email"]').clear().type(email)
  cy.get('input[type="password"]').clear().type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/onboarding')
  cy.wait(2000)
})

// Comando para navegar para painel administrativo
Cypress.Commands.add('goToAdminPanel', () => {
  cy.get('button').contains('Admin').click()
  cy.url().should('include', '/admin')
})

// Comando para fazer logout
Cypress.Commands.add('logout', () => {
  cy.get('button').contains('Sair').click()
  cy.url().should('include', '/welcome')
})

// Comando para limpar dados de teste (executar antes dos testes)
Cypress.Commands.add('cleanupTestData', () => {
  cy.request({
    method: 'DELETE',
    url: '/api/test/cleanup',
    failOnStatusCode: false
  })
})

// Comando para criar usuário de teste
Cypress.Commands.add('createTestUser', (userData) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/register',
    body: userData,
    failOnStatusCode: false
  })
})

// Comando para aguardar elemento aparecer
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible')
})
