const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testTimeout: 30000,
  globalSetup: async () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-jwt-secret-key';
  }
};
