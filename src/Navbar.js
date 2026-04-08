import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    navigate("/", { replace: true });
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const email = currentUser?.email || localStorage.getItem("userEmail");
  const role = currentUser?.role || localStorage.getItem("userRole") || "Food Donor";
  const name = currentUser?.name || (email ? email.split("@")[0] : "User");
  const displayRole = role === "Food Donor" ? "DONOR" : role === "Recipient" ? "RECIPIENT" : "ADMIN";

  return (
    <div className="navbar">
      <h2 className="logo">Food Waste Reduction</h2>

      <div className="nav-links">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span>
        {role === "Food Donor" && (
          <>
            <span onClick={() => navigate("/my-listings")}>My Listings</span>
            <span onClick={() => navigate("/list-food")}>List Food</span>
          </>
        )}
        {role === "Recipient" && (
          <>
            <span onClick={() => navigate("/browse-food")}>Browse Food</span>
            <span onClick={() => navigate("/my-claims")}>My Claims</span>
          </>
        )}
        {role === "Admin" && (
          <>
            <span onClick={() => navigate("/impact")}>Impact</span>
            <span onClick={() => navigate("/deliveries")}>Deliveries</span>
            <span onClick={() => navigate("/users")}>Users</span>
            <span onClick={() => navigate("/moderation")}>Moderation</span>
            <span onClick={() => navigate("/system-reports")}>System Reports</span>
          </>
        )}
      </div>

      <div className="nav-right">
        <span>{name} ({displayRole})</span>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;