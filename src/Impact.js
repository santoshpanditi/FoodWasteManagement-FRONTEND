import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import "./Impact.css";

function Impact() {
  const [foods, setFoods] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    fetch("https://foodwastemanagement-backend-production-404d.up.railway.app/api/foods")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const storedClaims = JSON.parse(localStorage.getItem("myClaims") || "[]");
    setClaims(storedClaims);
  }, []);

  const totalFoodDonated = useMemo(() => {
    return foods.reduce((sum, item) => {
      const qty = parseInt(item.quantity, 10);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0);
  }, [foods]);

  const totalClaims = claims.length;
  const pendingClaims = claims.filter((claim) => (claim.status || "Pending") === "Pending").length;
  const completedClaims = claims.filter((claim) => claim.status === "Completed").length;

  const co2Saved = useMemo(() => Math.round(totalFoodDonated * 1.7 * 10) / 10, [totalFoodDonated]);
  const mealsProvided = useMemo(() => totalFoodDonated * 2, [totalFoodDonated]);
  const peopleHelped = useMemo(() => Math.max(totalClaims, Math.round(totalFoodDonated * 0.9)), [totalClaims, totalFoodDonated]);
  const donationValue = useMemo(() => totalFoodDonated * 40, [totalFoodDonated]);

  return (
    <>
      <Navbar />
      <div className="impact-page">
        <div className="impact-container">
          <div className="impact-header">
            <h2>In Impact Dashboard</h2>
            <p>Real-time metrics showing our collective impact on food waste reduction across India.</p>
          </div>

          <div className="impact-row top-row">
            <div className="metric-card top-card">
              <div className="metric-label">CO₂ SAVED</div>
              <div className="metric-value">{co2Saved}</div>
              <div className="metric-unit">kg</div>
              <div className="metric-caption">Environment impact</div>
            </div>
            <div className="metric-card top-card">
              <div className="metric-label">MEALS PROVIDED</div>
              <div className="metric-value">{mealsProvided}</div>
              <div className="metric-unit">servings</div>
              <div className="metric-caption">Nutrition delivered</div>
            </div>
            <div className="metric-card top-card">
              <div className="metric-label">PEOPLE HELPED</div>
              <div className="metric-value">{peopleHelped}</div>
              <div className="metric-unit">people</div>
              <div className="metric-caption">Community impact</div>
            </div>
          </div>

          <div className="impact-row donation-row">
            <div className="metric-card donation-card">
              <div className="donation-icon">₹</div>
              <div className="donation-value">{donationValue.toLocaleString()}</div>
              <div className="donation-label">DONATION VALUE</div>
            </div>
          </div>

          <div className="impact-row charts-row">
            <div className="chart-card">
              <h3>Impact Metrics</h3>
              <div className="bar-chart">
                <div className="bar-group">
                  <span>CO₂ Saved</span>
                  <div className="bar-track"><div className="bar-fill fill-blue" style={{ height: Math.min(90, co2Saved) + "%" }} /></div>
                </div>
                <div className="bar-group">
                  <span>Meals Provided</span>
                  <div className="bar-track"><div className="bar-fill fill-purple" style={{ height: Math.min(90, mealsProvided / 3) + "%" }} /></div>
                </div>
                <div className="bar-group">
                  <span>Recipients Helped</span>
                  <div className="bar-track"><div className="bar-fill fill-pink" style={{ height: Math.min(90, peopleHelped / 2) + "%" }} /></div>
                </div>
              </div>
            </div>

            <div className="chart-card pie-card">
              <h3>Claim Distribution</h3>
              <div className="pie-visual">
                <div className="pie-center">{totalClaims || 0}</div>
              </div>
              <div className="pie-legend">
                <div><span className="legend-dot pending" /> Pending</div>
                <div><span className="legend-dot approved" /> Approved</div>
                <div><span className="legend-dot completed" /> Completed</div>
              </div>
            </div>
          </div>

          <div className="impact-row detail-row">
            <div className="detail-card">
              <span>Total Food Donated</span>
              <strong>{totalFoodDonated} kg</strong>
            </div>
            <div className="detail-card">
              <span>Waste Reduced</span>
              <strong>{totalFoodDonated} kg</strong>
            </div>
            <div className="detail-card">
              <span>Active Claims</span>
              <strong>{pendingClaims}</strong>
            </div>
            <div className="detail-card">
              <span>Completed Deliveries</span>
              <strong>{completedClaims}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Impact;
