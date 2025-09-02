const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ClientDetails = require('../models/ClientDetails');

const createTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jje');
    console.log('Connected to MongoDB');

    // Create admin user if it doesn't exist
    let admin = await User.findOne({ email: 'admin@jje.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 8);
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@jje.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Created admin user: admin@jje.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Create test client user if it doesn't exist
    let client = await User.findOne({ email: 'client@test.com' });
    if (!client) {
      const hashedPassword = await bcrypt.hash('client123', 8);
      client = await User.create({
        name: 'Test Client',
        email: 'client@test.com',
        password: hashedPassword,
        role: 'client'
      });
      console.log('Created client user: client@test.com / client123');
    } else {
      console.log('Client user already exists');
    }

    // Create client details if they don't exist
    let clientDetails = await ClientDetails.findOne({ userId: client._id });
    if (!clientDetails) {
      clientDetails = await ClientDetails.create({
        userId: client._id,
        companyName: 'Test Company Ltd.',
        gstNumber: '27ABCDE1234F1Z5',
        email: 'client@test.com',
        phone: '+91 9876543210',
        contactPerson: 'Test Client',
        panNumber: 'ABCDE1234F',
        address: '123 Test Street, Test City, Test State - 123456',
        bankDetails: 'Test Bank, Account: 1234567890, IFSC: TEST0001234'
      });
      console.log('Created client details');
    } else {
      console.log('Client details already exist');
    }

    console.log('\n=== TEST ACCOUNTS ===');
    console.log('Admin: admin@jje.com / admin123');
    console.log('Client: client@test.com / client123');
    console.log('==================');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('Error creating test data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createTestData();
