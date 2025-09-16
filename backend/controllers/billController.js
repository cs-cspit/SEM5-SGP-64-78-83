const Bill = require('../models/Bill');
const ClientDetails = require('../models/ClientDetails');
const User = require('../models/User');

// Get admin dashboard stats
exports.getAdminDashboardStats = async (req, res) => {
    try {
        // Get total clients (users with role 'user')
        const totalClients = await User.countDocuments({ role: 'user' });
        
        // Get total invoices
        const totalInvoices = await Bill.countDocuments();
        
        // Get all bills for calculations
        const bills = await Bill.find();
        
        // Calculate total revenue (all paid bills)
        const totalRevenue = bills
            .filter(bill => bill.status === 'paid')
            .reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        
        // Calculate pending payments (pending, sent, viewed bills)
        const pendingPayments = bills
            .filter(bill => ['pending', 'sent', 'viewed'].includes(bill.status))
            .reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        
        // Calculate payments received this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const paymentsReceived = bills
            .filter(bill => {
                const billDate = new Date(bill.date);
                return bill.status === 'paid' && 
                       billDate.getMonth() === currentMonth && 
                       billDate.getFullYear() === currentYear;
            })
            .reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        
        // Calculate collection rate
        const totalBilled = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        const collectionRate = totalBilled > 0 ? Math.round((totalRevenue / totalBilled) * 100) : 0;
        
        // Recent invoices (last 10)
        const recentInvoices = bills
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10)
            .map(bill => ({
                id: `INV-${String(bill.invoiceNo).padStart(3, '0')}`,
                _id: bill._id,
                companyName: bill.companyName,
                amount: bill.totalAmount,
                status: bill.status,
                date: bill.date
            }));
        
        // Bills by status
        const billsByStatus = {
            paid: bills.filter(bill => bill.status === 'paid').length,
            pending: bills.filter(bill => bill.status === 'pending').length,
            sent: bills.filter(bill => bill.status === 'sent').length,
            viewed: bills.filter(bill => bill.status === 'viewed').length,
            overdue: bills.filter(bill => bill.status === 'overdue').length
        };
        
        res.status(200).json({ 
            success: true, 
            data: {
                totalClients,
                totalInvoices,
                totalRevenue,
                pendingPayments,
                paymentsReceived,
                collectionRate,
                recentInvoices,
                billsByStatus
            }
        });
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new bill
exports.createBill = async (req, res) => {
    try {
        const bill = new Bill(req.body);
        await bill.save();
        res.status(201).json({ success: true, data: bill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all bills
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bills });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get single bill
exports.getBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ success: false, error: 'Bill not found' });
        }
        res.status(200).json({ success: true, data: bill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get next invoice number
exports.getNextInvoiceNumber = async (req, res) => {
    try {
        const lastBill = await Bill.findOne({}, {}, { sort: { 'invoiceNo': -1 } });
        const nextInvoiceNo = lastBill ? lastBill.invoiceNo + 1 : 1;
        res.status(200).json({ success: true, nextInvoiceNo });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update bill
exports.updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate status if provided
        if (req.body.status) {
            const validStatuses = ['draft', 'pending', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded'];
            if (!validStatuses.includes(req.body.status)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
                });
            }
        }

        const bill = await Bill.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!bill) {
            return res.status(404).json({ success: false, error: 'Bill not found' });
        }

        res.status(200).json({ success: true, data: bill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update bill status
exports.updateBillStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['draft', 'pending', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
            });
        }

        const bill = await Bill.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true, runValidators: true }
        );

        if (!bill) {
            return res.status(404).json({ success: false, error: 'Bill not found' });
        }

        res.status(200).json({ success: true, data: bill });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get client's own bills
exports.getMyBills = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get client details to find the company name
        const clientDetails = await ClientDetails.findOne({ userId });
        if (!clientDetails) {
            return res.status(404).json({ 
                success: false, 
                error: 'Client details not found' 
            });
        }

        // Find bills by company name
        const bills = await Bill.find({ 
            companyName: clientDetails.companyName 
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: bills });
    } catch (error) {
        console.error('Error fetching client bills:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get client's bill by ID
exports.getMyBill = async (req, res) => {
    try {
        const userId = req.user._id;
        const billId = req.params.id;
        
        // Get client details to verify ownership
        const clientDetails = await ClientDetails.findOne({ userId });
        if (!clientDetails) {
            return res.status(404).json({ 
                success: false, 
                error: 'Client details not found' 
            });
        }

        // Find bill by ID and company name
        const bill = await Bill.findOne({ 
            _id: billId,
            companyName: clientDetails.companyName 
        });

        if (!bill) {
            return res.status(404).json({ 
                success: false, 
                error: 'Bill not found or access denied' 
            });
        }

        // Mark bill as viewed if it's not already
        if (bill.status === 'sent') {
            bill.status = 'viewed';
            await bill.save();
        }

        res.status(200).json({ success: true, data: bill });
    } catch (error) {
        console.error('Error fetching client bill:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get client dashboard stats
exports.getClientDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get client details
        const clientDetails = await ClientDetails.findOne({ userId });
        if (!clientDetails) {
            return res.status(404).json({ 
                success: false, 
                error: 'Client details not found' 
            });
        }

        // Get all bills for this client
        const bills = await Bill.find({ 
            companyName: clientDetails.companyName 
        });

        // Calculate stats
        const totalInvoices = bills.length;
        const pendingPayments = bills.filter(bill => 
            ['pending', 'sent', 'viewed'].includes(bill.status)
        ).length;
        const totalSpent = bills
            .filter(bill => bill.status === 'paid')
            .reduce((sum, bill) => sum + bill.totalAmount, 0);

        // Get recent invoices (last 5)
        const recentInvoices = bills
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(bill => ({
                id: `INV-${String(bill.invoiceNo).padStart(3, '0')}`,
                _id: bill._id,
                amount: bill.totalAmount,
                status: bill.status === 'paid' ? 'Paid' : 
                       bill.status === 'viewed' ? 'Viewed' :
                       bill.status === 'sent' ? 'Sent' : 'Pending',
                date: bill.date
            }));

        res.status(200).json({ 
            success: true, 
            data: {
                totalInvoices,
                pendingPayments,
                totalSpent,
                recentInvoices
            }
        });
    } catch (error) {
        console.error('Error fetching client dashboard stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
