/**
 * Jest global setup — runs once before all test suites.
 * (Jest requires globalSetup to be a module path, not an inline function.)
 */
module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key';
};
