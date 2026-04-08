import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import "./MyClaims.css";
import { useNavigate } from "react-router-dom";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Claims");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/", { replace: true });
      return;
    }

    const storedClaims = JSON.parse(localStorage.getItem("myClaims") || "[]");
    const filteredClaims = storedClaims.filter((claim) => claim.userEmail === email);
    setClaims(filteredClaims);
  }, [navigate]);

  const filteredClaims = useMemo(() => {
    if (statusFilter === "All Claims") return claims;
    return claims.filter((item) => item.status === statusFilter);
  }, [claims, statusFilter]);

  const statusOptions = useMemo(() => {
    const setStatuses = new Set(claims.map((item) => item.status || "Pending"));
    return ["All Claims", ...Array.from(setStatuses)];
  }, [claims]);

  const saveClaims = (updatedClaims) => {
    localStorage.setItem("myClaims", JSON.stringify(updatedClaims));
    setClaims(updatedClaims);
  };

  const markCompleted = () => {
    if (!selectedClaim) return;
    const updated = claims.map((claim) =>
      claim.id === selectedClaim.id ? { ...claim, status: "Completed" } : claim
    );
    saveClaims(updated);
    setSelectedClaim({ ...selectedClaim, status: "Completed" });
  };

  const cancelClaim = () => {
    if (!selectedClaim) return;
    const updated = claims.filter((claim) => claim.id !== selectedClaim.id);
    saveClaims(updated);
    setSelectedClaim(null);
  };

  return (
    <>
      <Navbar />
      <div className="my-claims-page">
        <div className="my-claims-hero">
          <div>
            <h1>My Food Claims</h1>
            <p>Track the status of your food claims and donations received</p>
          </div>
        </div>

        <div className="my-claims-filter">
          <label>Filter by Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {filteredClaims.length === 0 ? (
          <div className="empty-state">No claims match this filter.</div>
        ) : (
          <div className="claims-list">
            {filteredClaims.map((claim, index) => (
              <div key={`${claim.id}-${index}`} className="claim-card">
                <div className="claim-card-top">
                  <h2>{claim.name}</h2>
                  <span className={`status-pill ${claim.status?.toLowerCase() || "pending"}`}>
                    {claim.status || "Pending"}
                  </span>
                </div>

                <div className="claim-row">
                  <span><strong>Quantity Claimed:</strong> {claim.quantity}</span>
                  <span><strong>Food Category:</strong> {claim.category || "General"}</span>
                  <span><strong>Donor:</strong> {claim.donor || "Community Donor"}</span>
                  <span><strong>Claimed Date:</strong> {claim.claimedDate || "-"}</span>
                </div>

                <div className="claim-row">
                  <span><strong>Pickup Location:</strong> {claim.location}</span>
                </div>

                <div className="claim-actions">
                  <button onClick={() => setSelectedClaim(claim)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedClaim && (
          <div className="claim-modal-overlay">
            <div className="claim-modal">
              <button className="close-button" onClick={() => setSelectedClaim(null)}>
                ×
              </button>
              <h2>Claim Details</h2>
              <div className="claim-details-row">
                <span>Status:</span>
                <strong>{selectedClaim.status || "Pending"}</strong>
              </div>
              <div className="claim-details-row">
                <span>Quantity:</span>
                <strong>{selectedClaim.quantity}</strong>
              </div>
              <div className="claim-details-row">
                <span>Claimed on:</span>
                <strong>{selectedClaim.claimedDate || "-"}</strong>
              </div>

              <div className="modal-button-row">
                {selectedClaim.status === "Approved" && (
                  <button className="primary-button" onClick={markCompleted}>
                    Mark as Completed
                  </button>
                )}
                {selectedClaim.status === "Pending" && (
                  <div className="modal-note">This claim is pending admin approval.</div>
                )}
                <button className="danger-button" onClick={cancelClaim}>
                  Cancel Claim
                </button>
                <button className="secondary-button" onClick={() => setSelectedClaim(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyClaims;
