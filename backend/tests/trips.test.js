const request = require('supertest');
const { createTestApp } = require('./helpers/app');
const tripRoutes = require('../routes/trips');
const authRoutes = require('../routes/auth');
const { testUtils } = require('./setup');

// Create test app
const app = createTestApp();
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

describe('Trips Routes', () => {
  let token, user;

  beforeEach(async () => {
    user = await testUtils.createTestUser({
      email: 'trips@iitr.ac.in'
    });
    token = testUtils.generateTestToken(user._id);
  });

  describe('POST /api/trips', () => {
    it('should create a new trip', async () => {
      const tripData = {
        title: 'Manali Adventure',
        destination: 'Manali',
        startDate: '2024-06-01T00:00:00.000Z',
        endDate: '2024-06-05T00:00:00.000Z',
        budget: 8000,
        mode: 'Bus',
        type: 'Adventure',
        description: 'Amazing trip to Manali',
        maxParticipants: 6
      };

      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${token}`)
        .send(tripData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(tripData.title);
      expect(response.body.data.destination).toBe(tripData.destination);
      expect(response.body.data.organizer).toBe(user._id.toString());
    });

    it('should not create trip without authentication', async () => {
      const tripData = {
        title: 'Manali Adventure',
        destination: 'Manali'
      };

      const response = await request(app)
        .post('/api/trips')
        .send(tripData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/trips', () => {
    beforeEach(async () => {
      // Create test trips
      await testUtils.createTestTrip(user._id, {
        title: 'Trip 1',
        destination: 'Shimla'
      });
      await testUtils.createTestTrip(user._id, {
        title: 'Trip 2',
        destination: 'Manali'
      });
    });

    it('should get all trips', async () => {
      const response = await request(app)
        .get('/api/trips')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    it('should filter trips by destination', async () => {
      const response = await request(app)
        .get('/api/trips?destination=Shimla')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].destination).toBe('Shimla');
    });

    it('should search trips by keyword', async () => {
      const response = await request(app)
        .get('/api/trips?search=Trip 1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Trip 1');
    });
  });

  describe('PUT /api/trips/:id', () => {
    let trip;

    beforeEach(async () => {
      trip = await testUtils.createTestTrip(user._id);
    });

    it('should update trip as organizer', async () => {
      const updateData = {
        title: 'Updated Trip Title',
        budget: 10000
      };

      const response = await request(app)
        .put(`/api/trips/${trip._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.budget).toBe(updateData.budget);
    });

    it('should not allow non-organizer to update trip', async () => {
      const otherUser = await testUtils.createTestUser({
        email: 'other@iitr.ac.in'
      });
      const otherToken = testUtils.generateTestToken(otherUser._id);

      const response = await request(app)
        .put(`/api/trips/${trip._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hacked Title' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/trips/:id', () => {
    let trip;

    beforeEach(async () => {
      trip = await testUtils.createTestTrip(user._id);
    });

    it('should delete trip as organizer', async () => {
      const response = await request(app)
        .delete(`/api/trips/${trip._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should not allow non-organizer to delete trip', async () => {
      const otherUser = await testUtils.createTestUser({
        email: 'other@iitr.ac.in'
      });
      const otherToken = testUtils.generateTestToken(otherUser._id);

      const response = await request(app)
        .delete(`/api/trips/${trip._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
