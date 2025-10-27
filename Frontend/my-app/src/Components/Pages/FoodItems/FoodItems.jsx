import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FoodItems.css";

export default function FoodItems() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
        setFilteredFoods(res.data);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };
    fetchFoods();
  }, []);

  // 🔹 Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = foods.filter((food) =>
      Object.entries(food).some(
        ([key, value]) =>
          key !== "image" &&
          String(value).toLowerCase().includes(term)
      )
    );
    setFilteredFoods(filtered);
  };

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Add new item to backend
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      const res = await axios.post("http://localhost:5000/api/foods", payload);
      const newFoods = [...foods, res.data];
      setFoods(newFoods);
      setFilteredFoods(newFoods);
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
        <input
          className="search-box"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add Items
        </button>
      </div>

      <div className="food-grid">
        {filteredFoods.map((food, index) => (
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
                <div
                  className="image-dropzone"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <p>Drag & Drop image here</p>
                  <button
                    type="button"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    Choose File
                  </button>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
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
