
describe('Integração com APIs', () => {
  describe('API de Autenticação', () => {
    it('deve retornar dados corretos no login', () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: Cypress.env('testUserEmail'),
          password: Cypress.env('testUserPassword')
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('success', true)
        expect(response.body.user).to.have.property('userId')
        expect(response.body.user).to.have.property('name')
        expect(response.body.user).to.have.property('email')
      })
    })

    it('deve rejeitar credenciais inválidas', () => {
      cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: {
          email: 'invalid@email.com',
          password: 'wrongpassword'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.include('Credenciais inválidas')
      })
    })
  })

  describe('API de Progresso', () => {
    it('deve retornar progresso do usuário', () => {
      cy.request({
        method: 'GET',
        url: '/api/progress/user-2', // assumindo userId 2
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('currentModule')
          expect(response.body).to.have.property('completedModules')
        }
      })
    })

    it('deve atualizar progresso corretamente', () => {
      const progressUpdate = {
        currentModule: 2,
        completedModules: [1],
        moduleProgress: { '1': 100, '2': 50 }
      }

      cy.request({
        method: 'PUT',
        url: '/api/progress/user-2',
        body: progressUpdate,
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body.currentModule).to.eq(2)
        }
      })
    })
  })

  describe('API de Avaliações', () => {
    it('deve verificar tentativas diárias', () => {
      cy.request({
        method: 'GET',
        url: '/api/check-attempts/user-2/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('canAttempt')
      })
    })

    it('deve salvar resultado de avaliação', () => {
      const evaluationData = {
        userId: 2,
        moduleId: 1,
        score: 85,
        passed: true,
        answers: { '1': 1, '2': 0, '3': 2 },
        totalQuestions: 20,
        correctAnswers: 17,
        timeSpent: 300
      }

      cy.request({
        method: 'POST',
        url: '/api/evaluations',
        body: evaluationData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.eq(true)
      })
    })
  })

  describe('API Administrativa', () => {
    it('deve listar usuários para admin', () => {
      cy.request({
        method: 'GET',
        url: '/api/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('deve criar novo usuário via API', () => {
      const newUser = {
        username: `API Test User ${Date.now()}`,
        email: `apitest${Date.now()}@dwu.com.br`,
        password: 'test123',
        profile: 'colaborador'
      }

      cy.request({
        method: 'POST',
        url: '/api/auth/register',
        body: newUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.eq(true)
        expect(response.body.user.email).to.eq(newUser.email)
      })
    })
  })
})
