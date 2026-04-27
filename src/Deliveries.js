import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import "./Deliveries.css";

function Deliveries() {
  const [foods, setFoods] = useState([]);
  const [claims, setClaims] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState({});

  useEffect(() => {
    fetch("https://foodwastemanagement-backend.onrender.com/api/foods")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error(err));

    const storedClaims = JSON.parse(localStorage.getItem("myClaims") || "[]");
    setClaims(storedClaims);

    const storedStatuses = JSON.parse(localStorage.getItem("deliveryStatus") || "{}");
    setDeliveryStatus(storedStatuses);
  }, []);

  const totalDeliveries = claims.length;
  const completedDeliveries = useMemo(
    () => claims.filter((claim) => claim.status === "Completed").length,
    [claims]
  );
  const totalFood = useMemo(
    () => claims.reduce((sum, claim) => sum + (parseInt(claim.quantity, 10) || 0), 0),
    [claims]
  );

  const scheduledDeliveries = useMemo(
    () => claims.filter((claim) => claim.status === "Approved" || claim.status === "Pending"),
    [claims]
  );

  const upcomingDeliveries = scheduledDeliveries.map((claim) => {
    const food = foods.find((item) => item.id === claim.id) || {};
    const statusKey = `${claim.id}-${claim.claimedDate}`;
    return {
      ...claim,
      foodName: food.name || claim.name || "Food Item",
      pickupDate: claim.claimedDate || "TBD",
      quantity: claim.quantity || "0 kg",
      recipient: claim.recipientName || "Recipient Org",
      location: food.location || claim.location || "Unknown",
      status: deliveryStatus[statusKey] || "Scheduled",
      statusKey,
    };
  });

  const updateDeliveryStatus = (statusKey, status) => {
    const updated = { ...deliveryStatus, [statusKey]: status };
    setDeliveryStatus(updated);
    localStorage.setItem("deliveryStatus", JSON.stringify(updated));
  };

  return (
    <>
      <Navbar />
      <div className="deliveries-page">
        <div className="deliveries-container">
          <div className="deliveries-header">
            <h1>Delivery Tracking</h1>
            <p>Monitor and manage food deliveries in real-time</p>
          </div>

          <div className="delivery-stats">
            <div className="delivery-stat-card">
              <span>Total Deliveries</span>
              <strong>{totalDeliveries}</strong>
            </div>
            <div className="delivery-stat-card">
              <span>Food Volume</span>
              <strong>{totalFood} kg</strong>
            </div>
            <div className="delivery-stat-card">
              <span>Scheduled</span>
              <strong>{scheduledDeliveries.length}</strong>
            </div>
            <div className="delivery-stat-card">
              <span>Completed</span>
              <strong>{completedDeliveries.length}</strong>
            </div>
          </div>

          <div className="delivery-list">
            {upcomingDeliveries.length === 0 ? (
              <div className="delivery-empty">No deliveries scheduled right now.</div>
            ) : (
              upcomingDeliveries.map((delivery, index) => (
                <div key={`${delivery.id}-${index}`} className="delivery-card">
                  <div className="delivery-card-head">
                    <h2>{delivery.foodName}</h2>
                    <span className={`delivery-badge ${delivery.status.toLowerCase().replace(/\s/g, "-")}`}>
                      {delivery.status}
                    </span>
                  </div>
                  <div className="delivery-details">
                    <div>
                      <span>Recipient:</span>
                      <strong>{delivery.recipient}</strong>
                    </div>
                    <div>
                      <span>Quantity:</span>
                      <strong>{delivery.quantity}</strong>
                    </div>
                    <div>
                      <span>Distance:</span>
                      <strong>0.00 km</strong>
                    </div>
                    <div>
                      <span>Pickup:</span>
                      <strong>{delivery.pickupDate}</strong>
                    </div>
                  </div>
                  <div className="delivery-actions">
                    {delivery.status === "Scheduled" && (
                      <button className="delivery-action-button in-transit" onClick={() => updateDeliveryStatus(delivery.statusKey, "In Transit")}>Mark In-Transit</button>
                    )}
                    {delivery.status === "In Transit" && (
                      <button className="delivery-action-button delivered" onClick={() => updateDeliveryStatus(delivery.statusKey, "Completed")}>Mark Delivered</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Deliveries;
