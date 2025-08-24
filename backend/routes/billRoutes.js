const express = require('express');
const router = express.Router();
const { createBill, getAllBills, getBill, getNextInvoiceNumber, updateBill, updateBillStatus } = require('../controllers/billController');
const { adminAuth } = require('../middleware/auth');

// Admin-only bill routes
router.post('/', adminAuth, createBill);
router.get('/', adminAuth, getAllBills);
router.get('/next-invoice', adminAuth, getNextInvoiceNumber);
router.get('/:id', adminAuth, getBill);
router.put('/:id', adminAuth, updateBill);
router.patch('/:id/status', adminAuth, updateBillStatus);

module.exports = router;
