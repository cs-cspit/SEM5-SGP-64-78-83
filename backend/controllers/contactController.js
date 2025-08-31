const Contact = require('../models/Contact');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: "Name, email, and message are required fields" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Create contact with user ID from auth middleware
    const contact = await Contact.create({ 
      userId: req.user._id,
      name, 
      email, 
      phone: phone || '', 
      company: company || '',
      subject: subject || '',
      message 
    });

    // Populate user details for response
    await contact.populate('userId', 'name email role');

    res.status(201).json({
      message: "Contact form submitted successfully",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        submittedBy: {
          id: contact.userId._id,
          name: contact.userId.name,
          email: contact.userId.email,
          role: contact.userId.role
        },
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all contact submissions (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });
    
    res.json({
      message: "Contacts retrieved successfully",
      count: contacts.length,
      contacts: contacts.map(contact => ({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        submittedBy: {
          id: contact.userId._id,
          name: contact.userId.name,
          email: contact.userId.email,
          role: contact.userId.role
        },
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { status } = req.body;

    if (!['pending', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be: pending, read, replied, or resolved" 
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId, 
      { status }, 
      { new: true }
    ).populate('userId', 'name email role');

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({
      message: "Contact status updated successfully",
      contact: {
        id: contact._id,
        status: contact.status,
        updatedAt: contact.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's own contact submissions
exports.getUserContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      message: "Your contact submissions retrieved successfully",
      count: contacts.length,
      contacts: contacts.map(contact => ({
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching user contacts:', error);
    res.status(500).json({ message: error.message });
  }
};
