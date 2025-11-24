import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Menu.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../ContextAPI/CartContext";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;


export default function Menu() {
  const [active, setActive] = useState("Pizza");
  const [showModal, setShowModal] = useState(true);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const { addToCart, setUserInfo } = useContext(CartContext);



  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/foods`);
        if (Array.isArray(res.data)) setFoods(res.data);
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };
    fetchFoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      party: e.target.party.value,
      address: e.target.address.value,
      contact: e.target.contact.value,
    };

    try {
      await axios.post(`${API_URL}/api/userDetails`, formData);
      setUserInfo({
        name: formData.name,
        phone: formData.contact,
        address: formData.address,
        party: formData.party,
        deliveryTime: "10 mins",
      });      
      
      setShowModal(false);
    } catch (err) {
      console.error("Error saving user details:", err);
      alert("Failed to save details. Try again!");
    }
  };

  const scrollLeft = () => {
    const wrapper = document.querySelector(".categories-wrapper");
    if (wrapper) wrapper.scrollBy({ left: -160, behavior: "smooth" });
  };

  const scrollRight = () => {
    const wrapper = document.querySelector(".categories-wrapper");
    if (wrapper) wrapper.scrollBy({ left: 160, behavior: "smooth" });
  };

  const filteredFoods = foods.filter(
    (item) =>
      item.category?.toLowerCase() === active.toLowerCase() &&
      (item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Enter Your Details</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="full name" required />
              <label htmlFor="party">Number of Person</label>
              <select id="party" name="party" required>
                <option value="">Select</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
              </select>
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" placeholder="address" required />
              <label htmlFor="contact">Contact</label>
              <input id="contact" name="contact" type="tel" placeholder="phone" required />
              <button type="submit" className="order-btn">Order Now</button>
            </form>
          </div>
        </div>
      )}

      <div className={`menu-container ${showModal ? "blurred" : ""}`}>
        <header>
          <h2>Good evening</h2>
          <p>Place your order here</p>
        </header>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="categories-container">
          <button className="arrow left" onClick={scrollLeft} aria-label="scroll left">
            ‹
          </button>
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
          <button className="arrow right" onClick={scrollRight} aria-label="scroll right">
            ›
          </button>
        </div>

        <h3 className="section-title">{active}</h3>

        <div className="grid-container">
          <div className="grid">
            {filteredFoods.length > 0 ? (
              filteredFoods.map((p) => (
                <div key={p._id} className="card">
                  <img
                    src={p.image || "https://via.placeholder.com/400x300"}
                    alt={p.name}
                  />
                  <div className="info">
                    <div className="item-name-price">
                      <p className="item-name">{p.name}</p>
                      <span className="price">₹ {p.price}</span>
                    </div>
                    <button
                      className="add-btn"
                      aria-label={`Add ${p.name}`}
                      onClick={() => {
                        addToCart({
                          ...p,
                          avgPrep: p.avgPrep || 0,
                        });
                        toast.success(`${p.name} added to cart!`);
                      }}
                                           
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">No items found</p>
            )}
          </div>
        </div>

        <button className="next-btn" onClick={() => navigate("/place-order")}>
          Next
        </button>
      </div>
    </>
  );
}
