const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  clearUserFine,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/profile', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.put('/clear-fine/:id', protect, adminOnly, clearUserFine);

module.exports = router;
