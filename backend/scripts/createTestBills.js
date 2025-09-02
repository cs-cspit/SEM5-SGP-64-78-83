require('dotenv').config();
const mongoose = require('mongoose');
const Bill = require('../models/Bill');

const createTestBill = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jje');
    console.log('Connected to MongoDB');

    // Create test bill for Test Company Ltd.
    const testBill = await Bill.create({
      companyName: 'Test Company Ltd.',
      address: '123 Test Street, Test City, Test State - 123456',
      workingSite: 'Main Office Building',
      clientName: 'Test Client',
      orderNumber: 'ORD-2024-001',
      date: new Date('2024-08-15'),
      paymentDueDate: new Date('2024-09-15'),
      companyGst: '27ABCDE1234F1Z5',
      products: [
        {
          productName: 'LED Light Fixtures',
          quantity: 10,
          hsn: '94054990',
          rate: 5000,
          gstRate: 18,
          discountRate: 0,
          basicAmount: 50000,
          cgst: 4500,
          sgst: 4500,
          total: 59000
        },
        {
          productName: 'Electrical Switches',
          quantity: 20,
          hsn: '85363000',
          rate: 500,
          gstRate: 18,
          discountRate: 5,
          basicAmount: 9500,
          cgst: 855,
          sgst: 855,
          total: 11210
        }
      ],
      totalCgst: 5355,
      totalSgst: 5355,
      netAmount: 59500,
      totalAmount: 70210,
      status: 'paid'
    });

    console.log('Test bill created:', {
      invoiceNo: testBill.invoiceNo,
      companyName: testBill.companyName,
      totalAmount: testBill.totalAmount,
      status: testBill.status
    });

    // Create another test bill
    const testBill2 = await Bill.create({
      companyName: 'Test Company Ltd.',
      address: '123 Test Street, Test City, Test State - 123456',
      workingSite: 'Branch Office',
      clientName: 'Test Client',
      orderNumber: 'ORD-2024-002',
      date: new Date('2024-08-20'),
      paymentDueDate: new Date('2024-09-20'),
      companyGst: '27ABCDE1234F1Z5',
      products: [
        {
          productName: 'Cable Management System',
          quantity: 5,
          hsn: '85444900',
          rate: 8000,
          gstRate: 18,
          discountRate: 0,
          basicAmount: 40000,
          cgst: 3600,
          sgst: 3600,
          total: 47200
        }
      ],
      totalCgst: 3600,
      totalSgst: 3600,
      netAmount: 40000,
      totalAmount: 47200,
      status: 'viewed'
    });

    console.log('Second test bill created:', {
      invoiceNo: testBill2.invoiceNo,
      companyName: testBill2.companyName,
      totalAmount: testBill2.totalAmount,
      status: testBill2.status
    });

    console.log('\nTest bills created successfully!');
    console.log('You can now test the ClientDashboard with real data.');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('Error creating test bills:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createTestBill();
