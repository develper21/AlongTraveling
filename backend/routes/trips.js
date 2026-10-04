const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripsByUser,
  getTripStats,
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');
const {
  createTripValidation,
  updateTripValidation,
} = require('../middleware/validation');

router.get('/', getTrips);
router.get('/stats', getTripStats);
router.get('/user/:userId', getTripsByUser);
router.get('/:id', getTrip);
router.post('/', protect, createTripValidation, createTrip);
router.put('/:id', protect, updateTripValidation, updateTrip);
router.delete('/:id', protect, deleteTrip);

module.exports = router;
