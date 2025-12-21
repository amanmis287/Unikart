import React, { useState } from "react";
import "../styles/Form.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("role", data.user.role);
        if (data.user.vendorType) {
          localStorage.setItem("vendorType", data.user.vendorType);
        }

        alert("Login successful!");

        if (data.user.role === "vendor") {
          window.location.href = `/vendor/${data.user.vendorType}`;
        } else {
          window.location.href = "/";
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2 className="form-title">UniKart Login</h2>

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

        <button type="submit" className="form-button">
          Login
        </button>
        <p className="form-footer">
          Not registered? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
