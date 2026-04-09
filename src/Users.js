import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import "./Users.css";

function Users() {
  const [foods, setFoods] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    fetch("https://foodwastemanagement-backend-production-404d.up.railway.app/api/foods")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error(err));

    const storedClaims = JSON.parse(localStorage.getItem("myClaims") || "[]");
    setClaims(storedClaims);
  }, []);

  const donorRows = useMemo(() => {
    const groups = {};
    foods.forEach((food) => {
      const donorName = food.donor || food.name || "Community Donor";
      const quantityValue = parseInt(food.quantity, 10) || 0;

      if (!groups[donorName]) {
        groups[donorName] = { donorName, listings: 0, totalFood: 0, distributed: 0 };
      }

      groups[donorName].listings += 1;
      groups[donorName].totalFood += quantityValue;
    });

    claims.forEach((claim) => {
      const donorName = claim.donor || "Community Donor";
      if (groups[donorName] && claim.status === "Completed") {
        groups[donorName].distributed += 1;
      }
    });

    return Object.values(groups);
  }, [foods, claims]);

  const recipientRows = useMemo(() => {
    const groups = {};
    claims.forEach((claim) => {
      const orgName = claim.recipientName || "Recipient Org";
      if (!groups[orgName]) {
        groups[orgName] = { organization: orgName, totalClaims: 0, approved: 0, completed: 0 };
      }

      groups[orgName].totalClaims += 1;
      if (claim.status === "Approved") groups[orgName].approved += 1;
      if (claim.status === "Completed") groups[orgName].completed += 1;
    });
    return Object.values(groups);
  }, [claims]);

  const totalDonors = donorRows.length;
  const totalOrgs = recipientRows.length;

  return (
    <>
      <Navbar />
      <div className="users-page">
        <div className="users-header">
          <h1>Users</h1>
          <p>Monitor and manage platform users</p>
        </div>

        <div className="users-section">
          <div className="users-card">
            <h2>Food Donors ({totalDonors})</h2>
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Total Listings</th>
                    <th>Total Food (kg)</th>
                    <th>Distributed</th>
                  </tr>
                </thead>
                <tbody>
                  {donorRows.length === 0 ? (
                    <tr>
                      <td colSpan="4">No donor listings found.</td>
                    </tr>
                  ) : (
                    donorRows.map((row) => (
                      <tr key={row.donorName}>
                        <td>{row.donorName}</td>
                        <td>{row.listings}</td>
                        <td>{row.totalFood}</td>
                        <td>{row.distributed}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="users-card">
            <h2>Recipient Organizations ({totalOrgs})</h2>
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Organization Name</th>
                    <th>Total Claims</th>
                    <th>Approved</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {recipientRows.length === 0 ? (
                    <tr>
                      <td colSpan="4">No recipient organizations found.</td>
                    </tr>
                  ) : (
                    recipientRows.map((row) => (
                      <tr key={row.organization}>
                        <td>{row.organization}</td>
                        <td>{row.totalClaims}</td>
                        <td>{row.approved}</td>
                        <td>{row.completed}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;
