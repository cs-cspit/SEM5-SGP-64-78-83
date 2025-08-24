const Bill = require('../models/Bill');

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
