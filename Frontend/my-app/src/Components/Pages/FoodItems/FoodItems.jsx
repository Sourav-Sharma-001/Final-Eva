import React from "react";
import "./FoodItems.css";

export default function FoodItems() {
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
    {
      name: "Burger",
      description: "Burger from Burger King",
      price: 199,
      avgPrep: "20 Mins",
      category: "Burgers",
      inStock: "Yes",
      rating: "4.5 ⭐",
    },
    {
      name: "Burger",
      description: "Burger from Burger King",
      price: 199,
      avgPrep: "20 Mins",
      category: "Burgers",
    },
    {
      name: "Burger",
      description: "Burger from Burger King",
      price: 199,
      avgPrep: "20 Mins",
      category: "Burgers",
    },
    {
      name: "Burger",
      description: "Burger from Burger King",
      price: 199,
      avgPrep: "20 Mins",
      category: "Burgers",
    },
    {
      name: "Burger",
      description: "Burger from Burger King",
      price: 199,
      avgPrep: "20 Mins",
      category: "Burgers",
    },
  ];

  return (
    <div className="food-page">
      <div className="top-bar">
        <input className="search-box" type="text" placeholder="Search" />
        <button className="add-btn">Add Items</button>
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
    </div>
  );
}
