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
      bankDetails,
    } = req.body;

    // Validate required fields
    if (!companyName || !gstNumber || !email || !phone || !address) {
      return res.status(400).json({
        message:
          "Required fields: Company Name, GST Number, Email, Phone, and Address",
      });
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

    // Generate default password: companyname@pan_last_4_digits
    let defaultPassword = "temp@123"; // fallback password
    if (companyName && panNumber && panNumber.length >= 4) {
      // Remove spaces and special characters from company name, convert to lowercase
      const cleanCompanyName = companyName
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      const panLast4 = panNumber.slice(-4);
      defaultPassword = `${cleanCompanyName}@${panLast4}`;
    } else if (companyName) {
      // If no PAN number, use company name with @123
      const cleanCompanyName = companyName
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      defaultPassword = `${cleanCompanyName}@123`;
    }

    // Create a basic user account for the client
    let user;
    try {
      user = await User.create({
        name: contactPerson || companyName,
        email,
        password: defaultPassword, // Generated password based on company name and PAN
        role: "client",
      });
      console.log("Client user created:", {
        id: user._id,
        email: user.email,
        role: user.role,
        defaultPassword: defaultPassword, // Log the generated password for admin reference
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
      generatedPassword: defaultPassword, // Include the generated password for admin reference
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
    console.log("Getting client details for user:", req.user._id);
    const userId = req.user._id;
    const clientDetails = await ClientDetails.findOne({ userId });

    console.log("Client details found:", clientDetails ? "Yes" : "No");

    if (!clientDetails) {
      return res.status(404).json({
        success: false,
        message:
          "Client details not found. You may not be registered as a client.",
      });
    }

    console.log("Returning client details:", clientDetails);
    res.json({
      success: true,
      data: clientDetails,
    });
  } catch (error) {
    console.error("Error in getMyClientDetails:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await ClientDetails.find()
      .populate("userId", "name email")
      .sort({ companyName: 1 });

    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update my client details (for authenticated clients)
exports.updateMyClientDetails = async (req, res) => {
  try {
    console.log("Updating client details for user:", req.user._id);
    const userId = req.user._id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Find and update client details
    const clientDetails = await ClientDetails.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!clientDetails) {
      return res.status(404).json({
        success: false,
        message:
          "Client details not found. You may not be registered as a client.",
      });
    }

    console.log("Client details updated successfully");
    res.json({
      success: true,
      message: "Client details updated successfully",
      data: clientDetails,
    });
  } catch (error) {
    console.error("Error in updateMyClientDetails:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "This GST number or email is already registered by another client",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
