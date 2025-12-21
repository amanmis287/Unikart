import React, { useState } from "react";
import "../styles/Form.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    vendorType: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok && data.success) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
      alert("Error registering user");
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2 className="form-title">UniKart Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="form-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          className="form-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="form-input"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="form-input">
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="vendor">Vendor</option>
        </select>
        {/* Vendor Type Dropdown (only shows when vendor is selected) */}
        {form.role === "vendor" && (
          <select
            name="vendorType"
            value={form.vendorType}
            onChange={handleChange}
            className="form-input"
            required>
            <option value="">Select Vendor Type</option>
            <option value="cafe">Café</option>
            <option value="xerox">Xerox & Stationery</option>
            <option value="library">Library</option>
          </select>
        )}
        <button type="submit" className="form-button">
          Register
        </button>
        <p className="form-footer">
          Already registered? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
