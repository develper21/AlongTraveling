const express = require('express');
const cors = require('cors');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  return app;
};

module.exports = { createTestApp };
