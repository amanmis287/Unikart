import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const vendorType = localStorage.getItem("vendorType");

  // If not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If vendor tries to open student/faculty pages → redirect to their dashboard
  if (role === "vendor" && !window.location.pathname.startsWith("/vendor")) {
    return <Navigate to={`/vendor/${vendorType}`} replace />;
  }

  // If student/faculty tries to open vendor pages → redirect to home
  if (role !== "vendor" && window.location.pathname.startsWith("/vendor")) {
    return <Navigate to="/" replace />;
  }

  if (
    role === "vendor" &&
    window.location.pathname.startsWith("/vendor") &&
    !window.location.pathname.includes(vendorType)
  ) {
    return <Navigate to={`/vendor/${vendorType}`} replace />;
  }

  // Role-based access check
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
