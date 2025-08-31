const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  getAllContacts, 
  updateContactStatus, 
  getUserContacts 
} = require('../controllers/contactController');
const { auth, adminAuth } = require('../middleware/auth');

// Protected routes - require authentication
router.post('/', auth, submitContact);
router.get('/my-contacts', auth, getUserContacts);

// Admin only routes
router.get('/all', adminAuth, getAllContacts);
router.patch('/:contactId/status', adminAuth, updateContactStatus);

module.exports = router;
