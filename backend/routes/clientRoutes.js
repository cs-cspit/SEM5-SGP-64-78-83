const express = require('express');
const router = express.Router();
const { createClient, getClientDetails } = require('../controllers/clientController');
const { adminAuth } = require('../middleware/auth');

// Only admin can create client users
router.post('/', adminAuth, createClient);
router.get('/:userId', adminAuth, getClientDetails);

module.exports = router;
