const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updatePassword
} = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
