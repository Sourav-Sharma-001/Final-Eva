import React, { useState } from "react";
import "./Menu.css";

export default function Menu() {
  const [active, setActive] = useState("Pizza");

  const categories = [
    { name: "Burger", icon: "🍔" },
    { name: "Pizza", icon: "🍕" },
    { name: "Drink", icon: "🥤" },
    { name: "French fries", icon: "🍟" },
    { name: "Veggies", icon: "🥦" },
  ];

  const pizzas = [
    { name: "Capricciosa", price: 200, img: "https://picsum.photos/200?1" },
    { name: "Sicilian", price: 150, img: "https://picsum.photos/200?2" },
    { name: "Marinara", price: 90, img: "https://picsum.photos/200?3" },
    { name: "Pepperoni", price: 300, img: "https://picsum.photos/200?4" },
    { name: "Marinara", price: 200, img: "https://picsum.photos/200?5" },
    { name: "Pepperoni", price: 200, img: "https://picsum.photos/200?6" },
  ];

  return (
    <div className="menu-container">
      <header>
        <h2>Good evening</h2>
        <p>Place you order here</p>
      </header>

      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>

      <div className="categories">
        {categories.map((c) => (
          <button
            key={c.name}
            className={active === c.name ? "active" : ""}
            onClick={() => setActive(c.name)}
          >
            <span>{c.icon}</span>
            <p>{c.name}</p>
          </button>
        ))}
      </div>

      <h3 className="section-title">{active}</h3>

      <div className="grid">
        {pizzas.map((p) => (
          <div key={p.name + p.price} className="card">
            <img src={p.img} alt={p.name} />
            <div className="info">
              <p>{p.name}</p>
              <div className="price-add">
                <span>₹ {p.price}</span>
                <button>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="next-btn">Next</button>
    </div>
  );
}
