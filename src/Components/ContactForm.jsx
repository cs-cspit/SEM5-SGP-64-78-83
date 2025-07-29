import React, { useState } from "react";
const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState("");
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.message) {
      setError("Email and message are required.");
      return;
    }
    // submit logic
    setError("");
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <input name="name" placeholder="Name" onChange={handleChange} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded" />
      <input name="email" placeholder="Email*" onChange={handleChange} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded" />
      <input name="phone" placeholder="Phone" onChange={handleChange} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded" />
      <textarea name="message" placeholder="Message*" onChange={handleChange} className="mb-2 w-full px-4 py-2 border border-gray-300 rounded"></textarea>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="bg-primary text-white px-6 py-2 rounded">Send Message</button>
    </form>
  );
};
export default ContactForm;
