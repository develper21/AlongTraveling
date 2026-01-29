const request = require('supertest');
const express = require('express');
const cors = require('cors');
const userRoutes = require('../routes/users');
const authRoutes = require('../routes/auth');
const { testUtils } = require('./setup');

// Create test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

describe('Users Routes', () => {
  let token, user;

  beforeEach(async () => {
    user = await testUtils.createTestUser({
      email: 'users@iitr.ac.in',
    });
    token = testUtils.generateTestToken(user._id);
  });

  describe('GET /api/users/:id', () => {
    it('should get user profile', async () => {
      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(user._id.toString());
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user profile as owner', async () => {
      const updateData = {
        name: 'Updated Name',
        branch: 'ECE',
        year: '4th Year',
        bio: 'Updated bio',
      };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.branch).toBe(updateData.branch);
    });

    it('should not allow non-owner to update profile', async () => {
      const otherUser = await testUtils.createTestUser({
        email: 'other@iitr.ac.in',
      });
      const otherToken = testUtils.generateTestToken(otherUser._id);

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ name: 'Hacked Name' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should not update without authentication', async () => {
      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({ name: 'Updated Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/:id/trips', () => {
    beforeEach(async () => {
      // Create test trips for the user
      await testUtils.createTestTrip(user._id, {
        title: 'User Trip 1',
      });
      await testUtils.createTestTrip(user._id, {
        title: 'User Trip 2',
      });
    });

    it('should get user trips', async () => {
      const response = await request(app)
        .get(`/api/users/${user._id}/trips`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].organizer).toBe(user._id.toString());
    });

    it('should return empty array for user with no trips', async () => {
      const newUser = await testUtils.createTestUser({
        email: 'notrips@iitr.ac.in',
      });

      const response = await request(app)
        .get(`/api/users/${newUser._id}/trips`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/users/:id/stats', () => {
    beforeEach(async () => {
      // Create test trips
      await testUtils.createTestTrip(user._id, {
        title: 'Trip 1',
      });
      await testUtils.createTestTrip(user._id, {
        title: 'Trip 2',
      });
    });

    it('should get user statistics', async () => {
      const response = await request(app)
        .get(`/api/users/${user._id}/stats`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tripsCreated).toBe(2);
      expect(response.body.data.tripsJoined).toBe(0);
      expect(typeof response.body.data.joinRequestsSent).toBe('number');
    });

    it('should return 404 for non-existent user stats', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/users/${fakeId}/stats`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
