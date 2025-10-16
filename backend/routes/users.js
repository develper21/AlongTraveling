const express = require('express');
const router = express.Router();
const {
  getUser,
  updateUser,
  getUserTrips,
  getUserParticipations,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Removed all validation middleware to skip validation
router.get('/:id', getUser);
router.put('/:id', protect, updateUser);
router.get('/:id/trips', getUserTrips);
router.get('/:id/participations', getUserParticipations);
router.get('/:id/stats', getUserStats);

module.exports = router;
