const express = require('express');
const router = express.Router();
const { 
    createBill, 
    getAllBills, 
    getBill, 
    getNextInvoiceNumber, 
    updateBill, 
    updateBillStatus,
    getMyBills,
    getMyBill,
    getClientDashboardStats,
    getAdminDashboardStats
} = require('../controllers/billController');
const { adminAuth, auth } = require('../middleware/auth');

// Admin-only bill routes
router.get('/admin/dashboard-stats', adminAuth, getAdminDashboardStats);
router.post('/', adminAuth, createBill);
router.get('/', adminAuth, getAllBills);
router.get('/next-invoice', adminAuth, getNextInvoiceNumber);
router.put('/:id', adminAuth, updateBill);
router.patch('/:id/status', adminAuth, updateBillStatus);

// Client routes - must come before generic /:id route
router.get('/my/dashboard-stats', auth, getClientDashboardStats);
router.get('/my/bills', auth, getMyBills);
router.get('/my/:id', auth, getMyBill);

// Admin route for specific bill (must come after client routes)
router.get('/:id', adminAuth, getBill);

module.exports = router;
