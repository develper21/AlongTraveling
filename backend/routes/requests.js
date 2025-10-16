const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getRequestsForTrip,
  getRequestsByUser,
  approveRequest,
  rejectRequest,
  cancelRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

// Removed all validation middleware to skip validation
router.post('/', protect, sendRequest);
router.get('/trip/:id', protect, getRequestsForTrip);
router.get('/user/:id', protect, getRequestsByUser);
router.put('/:id/approve', protect, approveRequest);
router.put('/:id/reject', protect, rejectRequest);
router.delete('/:id', protect, cancelRequest);

module.exports = router;
