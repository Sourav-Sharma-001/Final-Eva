import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FoodItems.css";

export default function FoodItems() {
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    description: "",
    price: "",
    avgPrep: "",
    category: "",
    inStock: "",
  });

  // 🔹 Fetch data from backend on load
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/foods");
        setFoods(res.data);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };
    fetchFoods();
  }, []);

  // 🔹 Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle image upload (convert to Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Add new item to backend
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/foods", formData);
      setFoods([...foods, res.data]); // update frontend list
      setFormData({
        image: "",
        name: "",
        description: "",
        price: "",
        avgPrep: "",
        category: "",
        inStock: "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error adding food item:", err);
    }
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
            <div className="food-img">
              {food.image ? (
                <img
                  src={food.image}
                  alt={food.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "1rem",
                    objectFit: "cover",
                  }}
                />
              ) : (
                "No Image"
              )}
            </div>
            <div className="food-info">
              <p>
                <strong>Name:</strong> {food.name}
              </p>
              <p>
                <strong>Description:</strong> {food.description}
              </p>
              <p>
                <strong>Price:</strong> ₹{food.price}
              </p>
              <p>
                <strong>Average Prep Time:</strong> {food.avgPrep} mins
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
              <label>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />

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
                type="number"
                name="avgPrep"
                placeholder="Average Preparation Time (mins)"
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
