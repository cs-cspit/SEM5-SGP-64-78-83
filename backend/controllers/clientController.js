const User = require("../models/User");
const ClientDetails = require("../models/ClientDetails");
const bcrypt = require("bcryptjs");

// Create a new client user
exports.createClient = async (req, res) => {
  try {
    const {
      companyName,
      gstNumber,
      email,
      phone,
      contactPerson,
      panNumber,
      address,
      bankDetails
    } = req.body;

    // Validate required fields
    if (
      !companyName ||
      !gstNumber ||
      !email ||
      !phone ||
      !address
    ) {
      return res.status(400).json({ message: "Required fields: Company Name, GST Number, Email, Phone, and Address" });
    }

    // Check if email already exists
    const emailExists = await ClientDetails.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if GST number already exists
    const gstExists = await ClientDetails.findOne({ gstNumber });
    if (gstExists) {
      return res.status(400).json({ message: "GST number already registered" });
    }

    // Create a basic user account for the client
    let user;
    try {
      user = await User.create({
        name: contactPerson || companyName,
        email,
        password: "temp123", // Default password - client should change this
        role: "client",
      });
      console.log("Client user created:", {
        id: user._id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Error creating client user:", error);
      return res.status(400).json({ message: "Error creating client user" });
    }

    // Create client details
    const clientDetails = await ClientDetails.create({
      userId: user._id,
      companyName,
      gstNumber,
      email,
      phone,
      contactPerson,
      panNumber,
      address,
      bankDetails,
    });

    res.status(201).json({
      message: "Client created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clientDetails: clientDetails,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        message: "This GST number or email is already registered",
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
      return res.status(404).json({ message: "Client details not found" });
    }

    res.json(clientDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my client details (for authenticated clients)
exports.getMyClientDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const clientDetails = await ClientDetails.findOne({ userId });

    if (!clientDetails) {
      return res.status(404).json({ message: "Client details not found" });
    }

    res.json(clientDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await ClientDetails.find()
      .populate('userId', 'name email')
      .sort({ companyName: 1 });

    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};