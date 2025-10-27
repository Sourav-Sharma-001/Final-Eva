import React, { useState } from "react";
import "./FoodItems.css";

export default function FoodItems() {
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    avgPrep: "",
    category: "",
    inStock: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setFoods([...foods, formData]);
    setFormData({
      name: "",
      description: "",
      price: "",
      avgPrep: "",
      category: "",
      inStock: "",
    });
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
                <label>Image</label>
                <div className="image-dropzone">Drag & Drop or Click</div>
              </div>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="avgPrep"
                placeholder="Average Preparation Time"
                value={formData.avgPrep}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="inStock"
                placeholder="Stock"
                value={formData.inStock}
                onChange={handleChange}
                required
              />

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
