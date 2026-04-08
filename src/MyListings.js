import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./MyListings.css";

function MyListings() {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    const res = await fetch("http://localhost:8080/foods");
    const data = await res.json();
    setFoods(data);
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    await fetch(`http://localhost:8080/deleteFood/${id}`, {
      method: "DELETE",
    });

    // remove from UI instantly
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const formatDate = (date) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <>
      <Navbar />

      <div className="outer">
        <div className="inner">
          <h1>My Food Listings</h1>

          <table className="table">
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {foods.map((food) => (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>{food.quantity}</td>
                  <td>{formatDate(food.expiry)}</td>
                  <td>{food.location}</td>
                  <td><span className="status">ACTIVE</span></td>

                  <td>
                    <button
                      className="view"
                      onClick={() => setSelectedFood(food)}
                    >
                      View
                    </button>

                    <button
                      className="delete"
                      onClick={() => handleDelete(food.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* MODAL */}
          {selectedFood && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>{selectedFood.name}</h2>

                <p><b>Quantity:</b> {selectedFood.quantity}</p>
                <p><b>Expiry:</b> {formatDate(selectedFood.expiry)}</p>
                <p><b>Location:</b> {selectedFood.location}</p>

                <button onClick={() => setSelectedFood(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyListings;