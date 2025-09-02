require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const ClientDetails = require('../models/ClientDetails');
const bcrypt = require('bcryptjs');

const createTestClient = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jje');
    
    // Check if test client already exists
    const clientExists = await User.findOne({ email: 'client@test.com' });
    
    if (clientExists) {
      console.log('Test client user already exists');
      
      // Check if client details exist
      const clientDetails = await ClientDetails.findOne({ userId: clientExists._id });
      if (!clientDetails) {
        // Create client details for existing user
        const details = await ClientDetails.create({
          userId: clientExists._id,
          companyName: 'Test Company Ltd.',
          gstNumber: '27ABCDE1234F1Z5',
          email: 'client@test.com',
          phone: '+91 9876543210',
          contactPerson: 'Test Client',
          panNumber: 'ABCDE1234F',
          address: '123 Test Street, Test City, Test State - 123456',
          bankDetails: 'Test Bank, Account: 1234567890, IFSC: TEST0001234'
        });
        console.log('Client details created for existing user');
      } else {
        console.log('Client details already exist');
      }
      
      process.exit(0);
    }

    // Create client user
    const password = await bcrypt.hash('client123', 8);
    const client = await User.create({
      name: 'Test Client',
      email: 'client@test.com',
      password,
      role: 'client'
    });

    // Create client details
    const clientDetails = await ClientDetails.create({
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

    console.log('Test client user created successfully:', {
      name: client.name,
      email: client.email,
      role: client.role,
      clientDetails: {
        companyName: clientDetails.companyName,
        gstNumber: clientDetails.gstNumber
      }
    });

    console.log('\nYou can now login with:');
    console.log('Email: client@test.com');
    console.log('Password: client123');
    
  } catch (error) {
    console.error('Error creating test client:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestClient();
