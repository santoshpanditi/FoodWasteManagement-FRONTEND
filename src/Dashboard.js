import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [foods, setFoods] = useState([]);
  const [totalQty, setTotalQty] = useState(0);
  const [claims, setClaims] = useState([]);

  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const email = currentUser?.email || localStorage.getItem("userEmail");
  const role = currentUser?.role || localStorage.getItem("userRole") || "Food Donor";

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
      return;
    }

    const storedClaims = JSON.parse(localStorage.getItem("myClaims") || "[]");
    const filteredClaims = storedClaims.filter((claim) => claim.userEmail === email);
    setClaims(role === "Admin" ? storedClaims : filteredClaims);
  }, [navigate, email, role]);

  const name = currentUser?.name || (email
    ? email.split("@")[0].charAt(0).toUpperCase() +
      email.split("@")[0].slice(1)
    : "User");

  const displayRole = role === "Food Donor" ? "DONOR" : role === "Recipient" ? "RECIPIENT" : "ADMIN";

  const totalClaims = useMemo(() => claims.length, [claims]);
  const pendingClaims = useMemo(
    () => claims.filter((claim) => (claim.status || "Pending") === "Pending").length,
    [claims]
  );
  const completedClaims = useMemo(
    () => claims.filter((claim) => claim.status === "Completed").length,
    [claims]
  );
  const completedQuantity = useMemo(() => {
    return claims.reduce((sum, claim) => {
      const found = claim.quantity?.match(/\d+/);
      const num = found ? parseInt(found[0], 10) : 0;
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }, [claims]);

  // 🔥 FETCH DATA FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:8080/foods")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);

        let total = 0;
        data.forEach((item) => {
          const num = parseInt(item.quantity);
          if (!isNaN(num)) total += num;
        });

        setTotalQty(total);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard">

        {/* TOP */}
        <div className="top-box">
          <h1>Welcome, {name}</h1>
          <p>Role: {displayRole}</p>
        </div>

        {role === "Admin" ? (
          <>
            <div className="cards">
              <div className="card">
                <h3>🍎 FOOD AVAILABLE</h3>
                <h2>{totalQty} kg</h2>
                <p>{foods.length} listings</p>
              </div>

              <div className="card">
                <h3>📦 ACTIVE CLAIMS</h3>
                <h2>{pendingClaims}</h2>
                <p>{pendingClaims} pending</p>
              </div>

              <div className="card">
                <h3>✅ COMPLETED DISTRIBUTIONS</h3>
                <h2>{completedClaims}</h2>
                <p>Total successful claims</p>
              </div>

              <div className="card">
                <h3>📊 WASTE REDUCED TODAY</h3>
                <h2>{completedQuantity} kg</h2>
                <p>Platform impact</p>
              </div>
            </div>

            <div className="listings-box">
              <h2>Platform Overview</h2>

              <div className="listings-cards">
                <div className="listing-card">
                  <p>TOTAL LISTINGS:</p>
                  <h3>{foods.length}</h3>
                </div>

                <div className="listing-card">
                  <p>TOTAL CLAIMS:</p>
                  <h3>{totalClaims}</h3>
                </div>

                <div className="listing-card">
                  <p>PENDING MODERATION:</p>
                  <h3>{0}</h3>
                </div>
              </div>
            </div>

            <div className="admin-table-box">
              <h2>Food Listings</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Location</th>
                      <th>Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.length === 0 ? (
                      <tr>
                        <td colSpan="5">No food listings available.</td>
                      </tr>
                    ) : (
                      foods.map((food) => (
                        <tr key={food.id}>
                          <td>{food.id}</td>
                          <td>{food.name}</td>
                          <td>{food.quantity}</td>
                          <td>{food.location}</td>
                          <td>{food.expiry}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="cards">
              <div className="card">
                <h3>🍎 FOOD AVAILABLE</h3>
                <h2>{totalQty}</h2>
                <p>{foods.length} listings</p>
              </div>

              <div className="card">
                <h3>📦 ACTIVE CLAIMS</h3>
                <h2>{pendingClaims}</h2>
                <p>{pendingClaims} pending</p>
              </div>

              <div className="card">
                <h3>✅ COMPLETED</h3>
                <h2>{completedClaims}</h2>
                <p>Total successful claims</p>
              </div>

              <div className="card">
                <h3>📊 WASTE REDUCED</h3>
                <h2>{completedQuantity} kg</h2>
                <p>Estimated</p>
              </div>
            </div>

            <div className="listings-box">
              <h2>Your Listings</h2>

              <div className="listings-cards">
                <div className="listing-card">
                  <p>ACTIVE LISTINGS:</p>
                  <h3>{foods.length}</h3>
                </div>

                <div className="listing-card">
                  <p>TOTAL FOOD DONATED:</p>
                  <h3>{totalQty} kg</h3>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
}

export default Dashboard;