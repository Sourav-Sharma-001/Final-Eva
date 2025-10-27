import React, { useState } from "react";
import "./FoodItems.css";

export default function FoodItems() {
  const [showModal, setShowModal] = useState(false);

  const foods = [
    {
      name: "Burger",
      description: "Burger from Burger King",
      price: 199,
      avgPrep: "20 Mins",
      category: "Burgers",
      inStock: "Yes",
      rating: "4.5 ⭐",
    },
  ];

  const handleAddItem = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <div className="food-page">
      <div className="top-bar">
        <input className="search-box" type="text" placeholder="Search" />
        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add Items
        </button>
      </div>

      <div className="food-grid">
        {foods.map((food, index) => (
          <div key={index} className="food-card">
            <div className="food-img">Image</div>
            <div className="food-info">
              <p>
                <strong>Name:</strong> {food.name}
              </p>
              <p>
                <strong>Description:</strong> {food.description}
              </p>
              <p>
                <strong>Price:</strong> {food.price}
              </p>
              <p>
                <strong>Average Prep Time:</strong> {food.avgPrep}
              </p>
              <p>
                <strong>Category:</strong> {food.category}
              </p>
              {food.inStock && (
                <p>
                  <strong>InStock:</strong> {food.inStock}
                </p>
              )}
              {food.rating && (
                <p>
                  <strong>Rating:</strong> {food.rating}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Item</h2>
            <form className="modal-form" onSubmit={handleAddItem}>
              <div className="image-upload">
                <label htmlFor="image">Image</label>
                <div className="image-dropzone">Drag & Drop or Click</div>
              </div>

              <input type="text" placeholder="Name" required />
              <input type="text" placeholder="Description" required />
              <input type="number" placeholder="Price" required />
              <input type="text" placeholder="Average Preparation Time" required />
              <input type="text" placeholder="Category" required />
              <input type="text" placeholder="Stock" required />

              <button type="submit" className="submit-btn">
                Add Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
