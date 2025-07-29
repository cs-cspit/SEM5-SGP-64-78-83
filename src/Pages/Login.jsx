import React, { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    // Auth logic here
    setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary">Client Login</h2>
        <input name="email" type="email" placeholder="Email" className="mb-4 w-full px-4 py-2 border rounded" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="mb-4 w-full px-4 py-2 border rounded" onChange={handleChange} />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button className="bg-primary text-white w-full py-2 rounded">Login</button>
      </form>
    </div>
  );
};
export default Login;
