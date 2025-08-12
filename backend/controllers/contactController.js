const Contact = require('../models/Contact');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contact = await Contact.create({ name, email, phone, message });
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
