import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Food Donor");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser && currentUser.email) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const rawProfiles = JSON.parse(localStorage.getItem("userProfiles") || "[]");
    const profiles = Array.isArray(rawProfiles) ? rawProfiles : Object.values(rawProfiles);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const matchingProfile = profiles.find(
      (profile) => profile.email === normalizedEmail && profile.password === normalizedPassword
    );

    const name = normalizedEmail
      .split("@")[0]
      .charAt(0)
      .toUpperCase() +
      normalizedEmail.split("@")[0].slice(1);

    const profile = matchingProfile
      ? {
          ...matchingProfile,
          lastLogin: new Date().toISOString(),
        }
      : {
          email: normalizedEmail,
          password: normalizedPassword,
          role,
          name,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

    const updatedProfiles = matchingProfile
      ? profiles.map((item) => (item.email === normalizedEmail && item.password === normalizedPassword ? profile : item))
      : [...profiles, profile];

    localStorage.setItem("userProfiles", JSON.stringify(updatedProfiles));
    localStorage.setItem("currentUser", JSON.stringify(profile));
    localStorage.setItem("userEmail", normalizedEmail);
    localStorage.setItem("userRole", profile.role);
    setErrorMessage("");

    navigate("/dashboard", { replace: true });
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-top">
          <h1>Food Waste Reduction Platform</h1>
          <p>Reduce Food Waste, Improve Food Security in India</p>
          <h2>Login</h2>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label>EMAIL</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>PASSWORD</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>ROLE</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Food Donor">Food Donor</option>
            <option value="Recipient">Recipient</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;