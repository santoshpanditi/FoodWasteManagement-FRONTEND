import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import "./Moderation.css";

function Moderation() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const storedClaims = JSON.parse(localStorage.getItem("myClaims") || "[]");
    setClaims(storedClaims);
  }, []);

  const pendingCount = useMemo(
    () => claims.filter((claim) => (claim.status || "Pending") === "Pending").length,
    [claims]
  );
  const approvedCount = useMemo(
    () => claims.filter((claim) => claim.status === "Approved").length,
    [claims]
  );
  const completedCount = useMemo(
    () => claims.filter((claim) => claim.status === "Completed").length,
    [claims]
  );

  const approveClaim = (id) => {
    const updated = claims.map((claim) =>
      claim.id === id ? { ...claim, status: "Approved" } : claim
    );
    localStorage.setItem("myClaims", JSON.stringify(updated));
    setClaims(updated);
  };

  const rejectClaim = (id) => {
    const updated = claims.map((claim) =>
      claim.id === id ? { ...claim, status: "Rejected" } : claim
    );
    localStorage.setItem("myClaims", JSON.stringify(updated));
    setClaims(updated);
  };

  const pendingClaims = claims.filter((claim) => (claim.status || "Pending") === "Pending");

  return (
    <>
      <Navbar />
      <div className="moderation-page">
        <div className="moderation-container">
          <div className="moderation-header">
            <h1>Moderation & Claims Management</h1>
            <p>Review and approve pending food claims</p>
          </div>

          <div className="moderation-cards">
            <div className="mod-card">
              <div className="mod-number">{pendingCount}</div>
              <div className="mod-label">Pending Claims</div>
            </div>
            <div className="mod-card">
              <div className="mod-number">{approvedCount}</div>
              <div className="mod-label">Approved</div>
            </div>
            <div className="mod-card">
              <div className="mod-number">{completedCount}</div>
              <div className="mod-label">Completed</div>
            </div>
          </div>

          {pendingClaims.length === 0 ? (
            <div className="empty-moderation">No pending claims to moderate</div>
          ) : (
            <div className="moderation-list">
              {pendingClaims.map((claim) => (
                <div key={`${claim.id}-${claim.claimedDate}-${claim.name}`} className="moderation-card">
                  <div className="moderation-card-top">
                    <h3>{claim.name}</h3>
                    <span>{claim.category || "General"}</span>
                  </div>
                  <div className="moderation-info">
                    <div>
                      <strong>Donor:</strong> {claim.donor || "Community Donor"}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {claim.quantity}
                    </div>
                    <div>
                      <strong>Pickup:</strong> {claim.location || "Unknown"}
                    </div>
                    <div>
                      <strong>Requested by:</strong> {claim.recipientName || "Recipient"}
                    </div>
                    <div>
                      <strong>Claimed on:</strong> {claim.claimedDate || "-"}
                    </div>
                  </div>
                  <div className="moderation-actions">
                    <button className="approve-button" onClick={() => approveClaim(claim.id)}>
                      Approve
                    </button>
                    <button className="reject-button" onClick={() => rejectClaim(claim.id)}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Moderation;
