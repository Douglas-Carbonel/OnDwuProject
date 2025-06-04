
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshot: false,
    setupNodeEvents(on, config) {
      // implementar plugins se necessário
    },
    env: {
      // Credenciais de teste
      testUserEmail: 'douglas@dwu.com.br',
      testUserPassword: 'douglas',
      adminEmail: 'admin@dwu.com.br',
      adminPassword: 'admin123'
    }
  },
})
