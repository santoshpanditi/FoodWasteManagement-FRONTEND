import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import "./SystemReports.css";

function SystemReports() {
  const [foods, setFoods] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    fetch("https://foodwastemanagement-backend.onrender.com/api/foods")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error(err));

    const storedClaims = JSON.parse(localStorage.getItem("myClaims") || "[]");
    setClaims(storedClaims);
  }, []);

  const totalListings = foods.length;
  const totalFoodListed = useMemo(
    () => foods.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0),
    [foods]
  );
  const totalClaims = claims.length;
  const wasteReduced = useMemo(
    () => claims.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0),
    [claims]
  );

  const listingStatus = useMemo(() => {
    const today = new Date();
    const expired = foods.filter((food) => {
      if (!food.expiry) return false;
      const expiryDate = new Date(food.expiry);
      return !isNaN(expiryDate) && expiryDate < today;
    }).length;

    const distributed = claims.filter((claim) => claim.status === "Completed").length;
    const available = Math.max(0, totalListings - expired - distributed);

    return [
      { label: "Available", count: available },
      { label: "Distributed", count: distributed },
      { label: "Expired", count: expired },
    ];
  }, [foods, claims, totalListings]);

  const claimStatus = useMemo(() => {
    const statusCounts = { Pending: 0, Approved: 0, Completed: 0, Rejected: 0 };
    claims.forEach((claim) => {
      const status = claim.status || "Pending";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  }, [claims]);

  const createRow = (label, count) => {
    const percentage = totalListings || totalClaims ? Math.round((count / (label === "Available" || label === "Distributed" || label === "Expired" ? totalListings : totalClaims || 1)) * 100) : 0;
    return (
      <tr key={label}>
        <td className="status-label">{label}</td>
        <td>{count}</td>
        <td>{percentage.toFixed(1)}%</td>
      </tr>
    );
  };

  return (
    <>
      <Navbar />
      <div className="reports-page">
        <div className="reports-container">
          <div className="reports-header">
            <h1>System Reports & Analytics</h1>
            <p>Overall platform statistics and performance</p>
          </div>

          <div className="reports-grid">
            <div className="report-card">
              <h3>Total Listings</h3>
              <div className="report-value">{totalListings}</div>
              <div className="report-label">Active platform listings</div>
            </div>
            <div className="report-card">
              <h3>Total Food Listed</h3>
              <div className="report-value">{totalFoodListed} kg</div>
              <div className="report-label">Total donation weight</div>
            </div>
            <div className="report-card">
              <h3>Total Claims</h3>
              <div className="report-value">{totalClaims}</div>
              <div className="report-label">Requests made by recipients</div>
            </div>
            <div className="report-card">
              <h3>Waste Reduced</h3>
              <div className="report-value">{wasteReduced} kg</div>
              <div className="report-label">Estimated rescued food</div>
            </div>
          </div>

          <div className="breakdown-row">
            <div className="breakdown-card">
              <h3>Listing Status Breakdown</h3>
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>{listingStatus.map((item) => createRow(item.label, item.count))}</tbody>
              </table>
            </div>
            <div className="breakdown-card">
              <h3>Claim Status Breakdown</h3>
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>{claimStatus.map((item) => createRow(item.status, item.count))}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SystemReports;
