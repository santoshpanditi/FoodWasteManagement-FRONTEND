import React, { useState } from "react";
import Navbar from "./Navbar";
import "./ListFood.css";

function ListFood() {
  const [food, setFood] = useState({
    name: "",
    quantity: "",
    expiry: "",
    location: "",
  });

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch("https://foodwastemanagement-backend-production-404d.up.railway.app/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(food),
      });

      alert("Food Added Successfully ✅");

      // clear form
      setFood({
        name: "",
        quantity: "",
        expiry: "",
        location: "",
      });

    } catch (error) {
      alert("Error adding food ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div className="outer">
        <div className="inner">
          <h1>List Your Food Donation</h1>
          <p>Help reduce food waste by sharing surplus food</p>

          <form className="card" onSubmit={handleSubmit}>
            
            <label>Food Item Name *</label>
            <input
              name="name"
              placeholder="e.g. Fresh Vegetables"
              value={food.name}
              onChange={handleChange}
            />

            <label>Quantity *</label>
            <input
              name="quantity"
              placeholder="Enter quantity"
              value={food.quantity}
              onChange={handleChange}
            />

            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiry"
              value={food.expiry}
              onChange={handleChange}
            />

            <label>Location *</label>
            <input
              name="location"
              placeholder="Pickup location"
              value={food.location}
              onChange={handleChange}
            />

            <div className="buttons">
              <button type="submit" className="primary">
                List Food
              </button>

              <button
                type="button"
                className="cancel"
                onClick={() =>
                  setFood({
                    name: "",
                    quantity: "",
                    expiry: "",
                    location: "",
                  })
                }
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

export default ListFood;