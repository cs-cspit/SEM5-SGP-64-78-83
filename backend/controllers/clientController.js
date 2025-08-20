const User = require('../models/User');
const ClientDetails = require('../models/ClientDetails');
const bcrypt = require('bcryptjs');

// Create a new client user
exports.createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      gstNumber,
      mobileNumber,
      address
    } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if GST number already exists
    const gstExists = await ClientDetails.findOne({ gstNumber });
    if (gstExists) {
      return res.status(400).json({ message: 'GST number already registered' });
    }

    // Create user with client role
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'client'
    });

    // Create client details
    const clientDetails = await ClientDetails.create({
      userId: user._id,
      companyName,
      gstNumber,
      mobileNumber,
      address
    });

    res.status(201).json({
      message: 'Client created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clientDetails: clientDetails
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        message: 'This GST number or email is already registered'
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Get client details
exports.getClientDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const clientDetails = await ClientDetails.findOne({ userId });
    
    if (!clientDetails) {
      return res.status(404).json({ message: 'Client details not found' });
    }

    res.json(clientDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
