const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getAllUsers, 
  updateUserRole,
  getProfile,
  deleteUser 
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);

// Admin routes
router.get('/all', adminAuth, getAllUsers);
router.patch('/role', adminAuth, updateUserRole);
router.delete('/:userId', adminAuth, deleteUser);

module.exports = router;
