
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server/index.js';

describe('API Tests', () => {
  let testUserId;
  let authCookie;

  beforeAll(async () => {
    // Setup test user
    const registerResponse = await request(app)
      .post('/api/register')
      .send({
        username: 'test_qa_user',
        password: 'testpass123',
        user_mail: 'qa@test.com',
        user_profile: 'colaborador'
      });
    
    testUserId = registerResponse.body.user?.id;

    // Login to get session
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        user_mail: 'qa@test.com',
        password: 'testpass123'
      });
    
    authCookie = loginResponse.headers['set-cookie'];
  });

  describe('Authentication', () => {
    it('should register new user', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'qa_test_2',
          password: 'testpass123',
          user_mail: 'qa2@test.com',
          user_profile: 'colaborador'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          user_mail: 'qa@test.com',
          password: 'testpass123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          user_mail: 'qa@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Progress Tracking', () => {
    it('should get user progress', async () => {
      const response = await request(app)
        .get(`/api/progress/${testUserId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('current_module');
    });

    it('should sync progress correctly', async () => {
      const response = await request(app)
        .post(`/api/sync-progress/${testUserId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Evaluations', () => {
    it('should check attempt limits', async () => {
      const response = await request(app)
        .get('/api/evaluations/attempts')
        .query({ userId: testUserId, moduleId: 1 })
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('canAttempt');
    });

    it('should save evaluation results', async () => {
      const evaluationData = {
        userId: testUserId,
        moduleNumber: 1,
        score: 85,
        totalQuestions: 20,
        correctAnswers: 17,
        passed: true,
        answers: { "1": 1, "2": 0, "3": 2 },
        timeSpent: 300
      };

      const response = await request(app)
        .post('/api/evaluations')
        .set('Cookie', authCookie)
        .send(evaluationData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Deadline Management', () => {
    it('should calculate deadline correctly', async () => {
      const response = await request(app)
        .get(`/api/check-deadline/${testUserId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('daysRemaining');
      expect(response.body).toHaveProperty('isExpired');
    });
  });

  afterAll(async () => {
    // Cleanup test data
    // Remove test users from database
  });
});
