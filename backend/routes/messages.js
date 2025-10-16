const express = require('express');
const router = express.Router();
const {
  getMessages,
  sendMessage,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// Removed all validation middleware to skip validation
router.get('/trip/:id', protect, getMessages);
router.get('/trip/:tripId', protect, getMessages);
router.post('/', protect, sendMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
