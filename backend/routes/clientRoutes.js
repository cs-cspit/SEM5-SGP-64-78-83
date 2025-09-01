const express = require('express');
const router = express.Router();
const { createClient, getClientDetails, getAllClients, getMyClientDetails } = require('../controllers/clientController');
const { auth, adminAuth } = require('../middleware/auth');

// Only admin can create client users
router.post('/', adminAuth, createClient);
router.get('/', adminAuth, getAllClients);
router.get('/:userId', adminAuth, getClientDetails);

// Clients can access their own details
router.get('/my/details', auth, getMyClientDetails);

module.exports = router;