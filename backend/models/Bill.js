const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    hsn: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    gstRate: {
        type: Number,
        default: 9,
        enum: [2.5, 6, 9, 12, 18]
    },
    discountRate: {
        type: Number,
        default: 0
    },
    basicAmount: {
        type: Number,
        required: true
    },
    cgst: {
        type: Number,
        required: true
    },
    sgst: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const billSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    workingSite: {
        type: String,
        required: true
    },
    invoiceNo: {
        type: Number,
        unique: true
    },
    clientName: {
        type: String,
        required: true
    },
    orderNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentDueDate: {
        type: Date,
        required: true
    },
    companyGst: {
        type: String,
        required: true
    },
    products: [productSchema],
    totalCgst: {
        type: Number,
        required: true
    },
    totalSgst: {
        type: Number,
        required: true
    },
    netAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded'],
        default: 'pending',
        required: true,
        index: true
    }
}, { timestamps: true });

// Auto-increment invoice number
billSchema.pre('save', async function(next) {
    if (!this.invoiceNo) {
        const lastBill = await this.constructor.findOne({}, {}, { sort: { 'invoiceNo': -1 } });
        this.invoiceNo = lastBill ? lastBill.invoiceNo + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('Bill', billSchema);
