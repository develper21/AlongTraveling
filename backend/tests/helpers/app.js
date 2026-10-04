const express = require('express');
const cors = require('cors');
const { errorHandler } = require('../../middleware/errorHandler');

// Create test app — call `setupErrorHandler(app)` AFTER mounting routes
// so controller `next(error)` responses match the real server (400/404…,
// not Express's default 500 HTML page).
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  return app;
};

const setupErrorHandler = (app) => {
  app.use(errorHandler);
};

module.exports = { createTestApp, setupErrorHandler };
