const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Global test utilities
global.testUtils = {
  createTestUser: async (userData = {}) => {
    const User = require('../models/User');
    const defaultUser = {
      name: 'Test User',
      email: 'test@iitr.ac.in',
      password: 'password123',
      branch: 'CSE',
      year: '3rd Year',
      bio: 'Test user bio'
    };
    return await User.create({ ...defaultUser, ...userData });
  },
  
  createTestTrip: async (organizerId, tripData = {}) => {
    const Trip = require('../models/Trip');
    const defaultTrip = {
      title: 'Test Trip',
      destination: 'Test Destination',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      budget: 5000,
      mode: 'Train',
      type: 'Adventure',
      description: 'Test trip description',
      organizer: organizerId,
      maxParticipants: 4
    };
    return await Trip.create({ ...defaultTrip, ...tripData });
  },
  
  generateTestToken: (userId) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret');
  }
};

module.exports = { testUtils: global.testUtils };
