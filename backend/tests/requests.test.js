const request = require('supertest');
const express = require('express');
const cors = require('cors');
const requestRoutes = require('../routes/requests');
const authRoutes = require('../routes/auth');
const tripRoutes = require('../routes/trips');
const { testUtils } = require('./setup');

// Create test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/requests', requestRoutes);

describe('Join Requests Routes', () => {
  let token, user, trip, otherUser, otherToken;

  beforeEach(async () => {
    // Create organizer
    user = await testUtils.createTestUser({
      email: 'organizer@iitr.ac.in',
    });
    token = testUtils.generateTestToken(user._id);

    // Create trip
    trip = await testUtils.createTestTrip(user._id);

    // Create other user for requests
    otherUser = await testUtils.createTestUser({
      email: 'requester@iitr.ac.in',
    });
    otherToken = testUtils.generateTestToken(otherUser._id);
  });

  describe('POST /api/requests', () => {
    it('should send join request', async () => {
      const requestData = {
        trip: trip._id,
        message: 'I would love to join this trip!',
      };

      const response = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${otherToken}`)
        .send(requestData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.trip).toBe(trip._id.toString());
      expect(response.body.data.user).toBe(otherUser._id.toString());
      expect(response.body.data.message).toBe(requestData.message);
      expect(response.body.data.status).toBe('pending');
    });

    it('should not send request without authentication', async () => {
      const requestData = {
        trip: trip._id,
        message: 'I want to join!',
      };

      const response = await request(app)
        .post('/api/requests')
        .send(requestData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not send duplicate request', async () => {
      // Create first request
      await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          trip: trip._id,
          message: 'First request',
        });

      // Try to send duplicate
      const response = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          trip: trip._id,
          message: 'Duplicate request',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already sent');
    });
  });

  describe('GET /api/requests/trip/:tripId', () => {
    beforeEach(async () => {
      // Create test requests
      await testUtils.createTestTrip(user._id);
      await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          trip: trip._id,
          message: 'Request 1',
        });
    });

    it('should get trip requests as organizer', async () => {
      const response = await request(app)
        .get(`/api/requests/trip/${trip._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].trip).toBe(trip._id.toString());
    });

    it('should not allow non-organizer to get trip requests', async () => {
      const response = await request(app)
        .get(`/api/requests/trip/${trip._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/requests/user/:userId', () => {
    beforeEach(async () => {
      // Create test request
      await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          trip: trip._id,
          message: 'My request',
        });
    });

    it('should get user requests as owner', async () => {
      const response = await request(app)
        .get(`/api/requests/user/${otherUser._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].user).toBe(otherUser._id.toString());
    });

    it('should not allow other users to get user requests', async () => {
      const response = await request(app)
        .get(`/api/requests/user/${otherUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/requests/:id/approve', () => {
    let requestId;

    beforeEach(async () => {
      // Create a request to approve
      const response = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          trip: trip._id,
          message: 'Approve me!',
        });

      requestId = response.body.data._id;
    });

    it('should approve request as organizer', async () => {
      const response = await request(app)
        .put(`/api/requests/${requestId}/approve`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('approved');
    });

    it('should not allow non-organizer to approve request', async () => {
      const response = await request(app)
        .put(`/api/requests/${requestId}/approve`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/requests/:id/reject', () => {
    let requestId;

    beforeEach(async () => {
      // Create a request to reject
      const response = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          trip: trip._id,
          message: 'Reject me!',
        });

      requestId = response.body.data._id;
    });

    it('should reject request as organizer', async () => {
      const response = await request(app)
        .put(`/api/requests/${requestId}/reject`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('rejected');
    });

    it('should not allow non-organizer to reject request', async () => {
      const response = await request(app)
        .put(`/api/requests/${requestId}/reject`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/requests/:id', () => {
    let requestId;

    beforeEach(async () => {
      // Create a request to cancel
      const response = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          trip: trip._id,
          message: 'Cancel me!',
        });

      requestId = response.body.data._id;
    });

    it('should cancel own request', async () => {
      const response = await request(app)
        .delete(`/api/requests/${requestId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should not allow other users to cancel request', async () => {
      const response = await request(app)
        .delete(`/api/requests/${requestId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
