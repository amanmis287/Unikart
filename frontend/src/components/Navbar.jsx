import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/logo1.png";

function Navbar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("role");
  const vendorType = localStorage.getItem("vendorType");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("vendorType");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <img src={logo} alt="UniKart Logo" className="app-logo" />
        <h2 className="logo">UniKart</h2>
      </div>

      {/* HAMBURGER */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        {!token ? (
          <>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)}>
              Xerox & Stationery
            </Link>
            <Link to="/cafe" onClick={() => setMenuOpen(false)}>
              Café
            </Link>
            <Link to="/library" onClick={() => setMenuOpen(false)}>
              Library
            </Link>
            <Link to="/notes" onClick={() => setMenuOpen(false)}>
              Notes
            </Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>
              Signup
            </Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          </>
        ) : (
          <>
            {(userRole === "student" || userRole === "faculty") && (
              <>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/shop" onClick={() => setMenuOpen(false)}>
                  Xerox & Stationery
                </Link>
                <Link to="/cafe" onClick={() => setMenuOpen(false)}>
                  Café
                </Link>
                <Link to="/library" onClick={() => setMenuOpen(false)}>
                  Library
                </Link>
                <Link to="/notes" onClick={() => setMenuOpen(false)}>
                  Notes
                </Link>
              </>
            )}

            {userRole === "vendor" && (
              <>
                {vendorType === "cafe" && (
                  <span className="logo2">Vendor Cafe Dashboard</span>
                )}
                {vendorType === "xerox" && (
                  <span className="logo2">Vendor Xerox Dashboard</span>
                )}
                {vendorType === "library" && (
                  <span className="logo2">Vendor Library Dashboard</span>
                )}
              </>
            )}

            <span className="welcome-msg">Hi, {userName || "User"}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
