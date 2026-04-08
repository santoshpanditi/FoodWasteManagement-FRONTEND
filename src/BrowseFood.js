import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import "./BrowseFood.css";
import { useNavigate } from "react-router-dom";

function BrowseFood() {
  const [foods, setFoods] = useState([]);
  const [foodAdjustments, setFoodAdjustments] = useState({});
  const [selectedFood, setSelectedFood] = useState(null);
  const [claimQty, setClaimQty] = useState(0);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const parseQuantityString = (value) => {
    const text = String(value || "").trim();
    const match = text.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) return { amount: 0, unit: "" };
    return { amount: parseFloat(match[1]), unit: match[2].trim() };
  };

  const formatQuantity = (amount, unit) => {
    if (unit) return `${amount}${unit.startsWith(" ") ? unit : ` ${unit}`}`.trim();
    return String(amount);
  };

  const categories = useMemo(() => {
    const cats = foods.map((item) => item.category || "General");
    return ["All", ...new Set(cats)];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    if (category === "All") return foods;
    return foods.filter((item) => (item.category || "General") === category);
  }, [foods, category]);

  const openClaimModal = (food) => {
    setSelectedFood(food);
    setClaimQty(0);
    setMessage("");
  };

  const closeClaimModal = () => {
    setSelectedFood(null);
  };

  const submitClaim = (e) => {
    e.preventDefault();

    if (!selectedFood) return;
    const quantityNumber = Number(claimQty);
    if (!quantityNumber || quantityNumber <= 0) {
      alert("Please enter a valid quantity to claim.");
      return;
    }

    const storedClaims = JSON.parse(localStorage.getItem("myClaims") || "[]");
    const email = localStorage.getItem("userEmail") || "recipient@org.com";
    const recipientName = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
    const parsed = parseQuantityString(selectedFood.quantity);
    const remainingAmount = Math.max(0, parsed.amount - quantityNumber);
    const updatedQuantity = remainingAmount > 0 ? formatQuantity(remainingAmount, parsed.unit) : "0";

    const nextAdjustments = { ...foodAdjustments };
    if (remainingAmount <= 0) {
      nextAdjustments[selectedFood.id] = { removed: true };
    } else {
      nextAdjustments[selectedFood.id] = { quantity: updatedQuantity };
    }
    localStorage.setItem("foodAdjustments", JSON.stringify(nextAdjustments));
    setFoodAdjustments(nextAdjustments);

    const nextClaims = [
      ...storedClaims,
      {
        id: selectedFood.id,
        userEmail: email,
        name: selectedFood.name,
        quantity: `${quantityNumber}${parsed.unit ? ` ${parsed.unit}` : ""}`.trim(),
        location: selectedFood.location || "Unknown",
        donor: selectedFood.donor || "Community Donor",
        recipientName,
        category: selectedFood.category || "General",
        requestedQuantity: quantityNumber,
        message: message.trim(),
        status: "Pending",
        claimedDate: new Date().toISOString().slice(0, 10),
      },
    ];

    localStorage.setItem("myClaims", JSON.stringify(nextClaims));
    closeClaimModal();
    navigate("/my-claims");
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/", { replace: true });
      return;
    }

    const storedAdjustments = JSON.parse(localStorage.getItem("foodAdjustments") || "{}");
    setFoodAdjustments(storedAdjustments);

    fetch("http://localhost:8080/foods")
      .then((res) => res.json())
      .then((data) => {
        const adjustedFoods = data
          .map((item) => {
            const adjustment = storedAdjustments[item.id];
            if (adjustment?.removed) return null;
            if (adjustment?.quantity) {
              return { ...item, quantity: adjustment.quantity };
            }
            return item;
          })
          .filter(Boolean);
        setFoods(adjustedFoods);
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="browse-food-page">
        <div className="browse-food-hero">
          <div>
            <h1>Browse Available Food</h1>
            <p>Find food donations from our community donors</p>
          </div>
        </div>

        <div className="browse-food-filter">
          <label>Filter by Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="food-grid">
          {filteredFoods.length === 0 ? (
            <div className="empty-state">No food donations found for this category.</div>
          ) : (
            filteredFoods.map((food) => (
              <div key={food.id} className="food-card">
                <div className="food-card-top">
                  <div>
                    <h2>{food.name}</h2>
                    <p>{food.description || "Fresh donation item available now."}</p>
                  </div>
                  <span className="food-chip">{food.category || "General"}</span>
                </div>

                <div className="food-card-details">
                  <div>
                    <span>Quantity:</span>
                    <strong>{food.quantity || "N/A"}</strong>
                  </div>
                  <div>
                    <span>Expires:</span>
                    <strong>{food.expiry || "Not specified"}</strong>
                  </div>
                  <div>
                    <span>Location:</span>
                    <strong>{food.location || "Unknown"}</strong>
                  </div>
                  <div>
                    <span>Donor:</span>
                    <strong>{food.donor || "Community Donor"}</strong>
                  </div>
                </div>

                <button className="claim-button" onClick={() => openClaimModal(food)}>
                  Claim Food
                </button>
              </div>
            ))
          )}
        </div>

        {selectedFood && (
          <div className="claim-modal-overlay">
            <div className="claim-modal">
              <button className="close-button" onClick={closeClaimModal}>
                ×
              </button>
              <h2>Claim Food: {selectedFood.name}</h2>
              <p className="modal-subtitle">Quantity to Claim *</p>
              <form onSubmit={submitClaim}>
                <input
                  type="number"
                  min="1"
                  value={claimQty}
                  onChange={(e) => setClaimQty(e.target.value)}
                  placeholder="0"
                />
                <p className="modal-note">Available: {selectedFood.quantity || "N/A"}</p>

                <label>Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message for the donor"
                />

                <div className="modal-info-row">
                  <span><strong>Your Organization:</strong> {selectedFood.donor || "Community Donor"}</span>
                  <span><strong>Pickup Location:</strong> {selectedFood.location || "Unknown"}</span>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="primary-submit">
                    Submit Claim
                  </button>
                  <button type="button" className="secondary-cancel" onClick={closeClaimModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BrowseFood;
