import React, { useState } from "react";
import "./Menu.css";

export default function Menu() {
  const [active, setActive] = useState("Pizza");
  const [showModal, setShowModal] = useState(true); // modal visible initially

  const categories = [
    { name: "Burger", icon: "🍔" },
    { name: "Pizza", icon: "🍕" },
    { name: "Drink", icon: "🥤" },
    { name: "French fries", icon: "🍟" },
    { name: "Veggies", icon: "🥦" },
    { name: "Sandwich", icon: "🥪" },
    { name: "Ice Cream", icon: "🍨" },
    { name: "Sushi", icon: "🍣" },
    { name: "Cake", icon: "🍰" },
    { name: "Coffee", icon: "☕" },
  ];

  const pizzas = [
    { name: "Capricciosa", price: 200, img: "https://picsum.photos/400/300?1" },
    { name: "Sicilian", price: 150, img: "https://picsum.photos/400/300?2" },
    { name: "Marinara", price: 90, img: "https://picsum.photos/400/300?3" },
    { name: "Pepperoni", price: 300, img: "https://picsum.photos/400/300?4" },
    { name: "Marinara", price: 200, img: "https://picsum.photos/400/300?5" },
    { name: "Pepperoni", price: 200, img: "https://picsum.photos/400/300?6" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const scrollLeft = () => {
    const wrapper = document.querySelector(".categories-wrapper");
    if (wrapper) {
      wrapper.scrollBy({
        left: -160,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const wrapper = document.querySelector(".categories-wrapper");
    if (wrapper) {
      wrapper.scrollBy({
        left: 160,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Enter Your Details</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="full name" required />

              <label htmlFor="party">Number of Person</label>
              <input id="party" name="party" type="number" min="1" placeholder="2, 4, 6" required />

              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" placeholder="address" required />

              <label htmlFor="contact">Contact</label>
              <input id="contact" name="contact" type="tel" placeholder="phone" required />

              <button type="submit" className="order-btn">Order Now</button>
            </form>
          </div>
        </div>
      )}

      {/* ===== MENU PAGE ===== */}
      <div className={`menu-container ${showModal ? "blurred" : ""}`}>
        <header>
          <h2>Good evening</h2>
          <p>Place you order here</p>
        </header>

        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>

        <div className="categories-container">
          <button className="arrow left" onClick={scrollLeft} aria-label="scroll left">‹</button>
          <div className="categories-wrapper" role="list">
            {categories.map((c) => (
              <button
                key={c.name}
                className={active === c.name ? "active" : ""}
                onClick={() => setActive(c.name)}
                role="listitem"
              >
                <span className="cat-icon" aria-hidden="true">{c.icon}</span>
                <p className="cat-name">{c.name}</p>
              </button>
            ))}
          </div>
          <button className="arrow right" onClick={scrollRight} aria-label="scroll right">›</button>
        </div>

        <h3 className="section-title">{active}</h3>

        <div className="grid-container">
          <div className="grid">
            {pizzas.map((p) => (
              <div key={p.name + p.price} className="card">
                <img src={p.img} alt={p.name} />
                <div className="info">
                  <p className="item-name">{p.name}</p>
                  <div className="price-add">
                    <span className="price">₹ {p.price}</span>
                    <button className="add-btn" aria-label={`Add ${p.name}`}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="next-btn">Next</button>
      </div>
    </>
  );
}
