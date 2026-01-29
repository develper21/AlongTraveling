const request = require('supertest');
const { createTestApp } = require('./helpers/app');
const authRoutes = require('../routes/auth');
const { testUtils } = require('./setup');

// Create test app
const app = createTestApp();
app.use('/api/auth', authRoutes);

describe('Authentication Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@iitr.ac.in',
        password: 'password123',
        branch: 'CSE',
        year: '3rd Year',
        bio: 'Test bio'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.password).toBeUndefined();
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('email');
    });

    it('should not register duplicate user', async () => {
      await testUtils.createTestUser({
        email: 'duplicate@iitr.ac.in'
      });

      const userData = {
        name: 'John Doe',
        email: 'duplicate@iitr.ac.in',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await testUtils.createTestUser({
        email: 'login@iitr.ac.in',
        password: 'password123'
      });
    });

    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'login@iitr.ac.in',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.email).toBe(loginData.email);
    });

    it('should not login with invalid password', async () => {
      const loginData = {
        email: 'login@iitr.ac.in',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not login non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@iitr.ac.in',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let token, user;

    beforeEach(async () => {
      user = await testUtils.createTestUser({
        email: 'me@iitr.ac.in'
      });
      token = testUtils.generateTestToken(user._id);
    });

    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(user._id.toString());
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
