import React, { useState, useRef, useEffect } from "react";
import "./PlaceOrder.css";
import axios from "axios";
import { useCart } from "../../ContextAPI/CartContext";
import { useNavigate } from "react-router-dom";

export default function PlaceOrder() {
  const { cartItems, clearCart } = useCart(); // clearCart may be undefined if not provided — checked later
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("dinein");
  const [ordered, setOrdered] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const trackWidthRef = useRef(1);
  const knobWidthRef = useRef(1);
  const startProgressRef = useRef(0);

  // env fallback: use whichever you set, or default to backend on 5000
  const API_URL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000";

  // Dynamic user info placeholder (you can replace with real user data later)
  const user = {
    name: "Divya Sigatapu",
    phone: "9109109109",
    address: "Flat no: 301, SVR Enclave, Hyper Nagar, Vasavi Colony, Hyderabad",
    deliveryTime: "42 mins",
  };

  // Safe cart
  const safeCart = Array.isArray(cartItems) ? cartItems : [];

  // Calculations
  const itemTotal = safeCart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );
  const deliveryCharge = orderType === "takeaway" ? 50 : 0;
  const taxes = 5;
  const grandTotal = itemTotal + deliveryCharge + taxes;

  // Swipe setup
  useEffect(() => {
    const track = trackRef.current;
    const knob = knobRef.current;
    if (track && knob) {
      trackWidthRef.current = track.getBoundingClientRect().width;
      knobWidthRef.current = knob.getBoundingClientRect().width;
    }

    const onResize = () => {
      if (track && knob) {
        trackWidthRef.current = track.getBoundingClientRect().width;
        knobWidthRef.current = knob.getBoundingClientRect().width;
        setSwipeProgress((p) => Math.min(1, Math.max(0, p)));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = (e) => {
    if (ordered) return;
    draggingRef.current = true;
    startProgressRef.current = swipeProgress;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    startXRef.current = clientX;
    try {
      e.target.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current || ordered) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const dx = clientX - startXRef.current;
    const maxTravel = Math.max(
      1,
      trackWidthRef.current - knobWidthRef.current - 6
    );
    let newLeft = startProgressRef.current * maxTravel + dx;
    newLeft = Math.max(0, Math.min(maxTravel, newLeft));
    setSwipeProgress(newLeft / maxTravel);
  };

  const onPointerUp = async (e) => {
    if (!draggingRef.current || ordered) return;
    draggingRef.current = false;
    const threshold = 0.72;

    // if cart empty — snap back and do nothing
    if (safeCart.length === 0) {
      setSwipeProgress(0);
      return;
    }

    if (swipeProgress >= threshold) {
      setSwipeProgress(1);
      setOrdered(true);

      // prepare order data matching your backend schema
      const orderData = {
        items: safeCart.map((item) => ({
          // send itemId if available to link to Food collection
          itemId: item._id || item.itemId || undefined,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category || "General",
          averagePreparationTime: item.averagePreparationTime || 5,
        })),
        orderType: orderType === "dinein" ? "dine-in" : "takeaway",
        tableNumber: orderType === "dinein" ? 5 : null, // change to real table if available
        customerName: user.name,
        phoneNumber: user.phone,
        address: orderType === "takeaway" ? user.address : "",
        totalAmount: grandTotal,
        status: "processing",
        orderTime: new Date(),
      };

      try {
        const res = await axios.post(`${API_URL}/api/orders`, orderData);
        console.log("Order saved:", res.data);

        // show thank you overlay for 2 seconds then clear cart and redirect
        setShowThankYou(true);
        setTimeout(() => {
          setShowThankYou(false);

          // clear cart if function available
          try {
            if (typeof clearCart === "function") clearCart();
          } catch (err) {
            console.warn("clearCart failed:", err);
          }

          // redirect to home (you said show thank you then redirect)
          navigate("/");
        }, 2000);
      } catch (err) {
        console.error("Order save error:", err);
        // revert swipe if error
        setSwipeProgress(0);
        setOrdered(false);
      }
    } else {
      setSwipeProgress(0);
    }

    try {
      e.target.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const knobTranslateX = () => {
    const maxTravel = Math.max(
      1,
      trackWidthRef.current - knobWidthRef.current - 6
    );
    return swipeProgress * maxTravel;
  };

  return (
    <div className="order-wrapper">
      <div className="order-page">
        <div className="top-area">
          <h2 className="greeting">Good evening</h2>
          <p className="sub-text">Place your order here</p>
        </div>

        <div className="search-box">
          <input type="text" placeholder="Search" aria-label="Search" />
        </div>

        {/* Dynamic item list */}
        <div
          className="items-scroll"
          style={{
            maxHeight: "24rem",
            overflowY: "auto",
            paddingRight: "0.5rem",
          }}
        >
          {safeCart.length === 0 ? (
            <p className="empty-cart">No items in cart</p>
          ) : (
            safeCart.map((item) => (
              <div key={item._id || item.itemId || item.name} className="item-card">
                <div className="img-wrap">
                  <img
                    src={item.image || "https://via.placeholder.com/400x300"}
                    alt={item.name}
                    className="item-img"
                  />
                </div>

                <div className="item-info">
                  <div className="item-header">
                    <h3 className="item-title">{item.name}</h3>
                    <button className="remove-btn" aria-label="Remove item">
                      ✖
                    </button>
                  </div>

                  <p className="price">₹ {item.price * item.quantity}</p>

                  <div className="qty-row">
                    <div className="qty-selector">
                      <button className="qty-btn">-</button>
                      <div className="qty-value">{item.quantity}</div>
                      <button className="qty-btn">+</button>
                    </div>
                  </div>

                  <input
                    type="text"
                    className="cooking-note"
                    placeholder="Add cooking instructions (optional)"
                    onFocus={() => setShowPopup(true)}
                    readOnly
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dine In / Take Away */}
        <div className="order-type">
          <button
            className={`seg-btn ${orderType === "dinein" ? "active" : ""}`}
            onClick={() => setOrderType("dinein")}
          >
            Dine In
          </button>
          <button
            className={`seg-btn ${orderType === "takeaway" ? "active" : ""}`}
            onClick={() => setOrderType("takeaway")}
          >
            Take Away
          </button>
        </div>

        {/* Bill section */}
        <div className="bill-box">
          <div className="bill-row">
            <span>Item Total</span>
            <span>₹{(itemTotal || 0).toFixed(2)}</span>
          </div>

          {orderType === "takeaway" && (
            <div className="bill-row">
              <span>Delivery Charge</span>
              <span>₹{(deliveryCharge || 0).toFixed(2)}</span>
            </div>
          )}

          <div className="bill-row">
            <span>Taxes</span>
            <span>₹{(taxes || 0).toFixed(2)}</span>
          </div>

          <div className="total-row">
            <span>Grand Total</span>
            <span>₹{(grandTotal || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Address / details block */}
        {orderType === "takeaway" && (
          <div className="details-block">
            <h4 className="details-title">Your details</h4>
            <p className="user-name">
              {user.name}, {user.phone}
            </p>

            <div className="address-box">
              <span className="address-pin">📍</span>
              <span className="address-text">Delivery at Home - {user.address}</span>
            </div>

            <div className="delivery-time">
              <span className="time-pin">⏱</span>
              <span>
                Delivery in <strong>{user.deliveryTime}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Swipe bar */}
      <div className="swipe-container">
        <div
          className={`swipe-track ${ordered ? "ordered" : ""}`}
          ref={trackRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            className="swipe-fill"
            style={{ width: `${Math.round(swipeProgress * 100)}%` }}
            aria-hidden
          />

          <div
            className="swipe-knob"
            ref={knobRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{ transform: `translateX(${knobTranslateX()}px)` }}
            role="button"
            tabIndex={0}
            aria-label="Swipe to confirm order"
          >
            {!ordered ? "→" : "✓"}
          </div>

          <div className={`swipe-label ${ordered ? "done" : ""}`}>
            {!ordered ? "Swipe to Order" : "Order Placed"}
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-close" onClick={() => setShowPopup(false)}>
              ✕
            </div>

            <h2 className="popup-title">Add Cooking instructions</h2>

            <textarea
              className="popup-textarea"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
            ></textarea>

            <p className="popup-info">
              The restaurant will try its best to follow your request. However,
              refunds or cancellations in this regard won’t be possible
            </p>

            <div className="popup-buttons">
              <button
                className="popup-cancel"
                onClick={() => {
                  setNoteValue("");
                  setShowPopup(false);
                }}
              >
                Cancel
              </button>
              <button
                className="popup-next"
                onClick={() => setShowPopup(false)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank you overlay shown for 2s when order placed */}
      {showThankYou && (
        <div className="thankyou-overlay" aria-live="polite">
          <div className="thankyou-box">
            <h2>Thank you!</h2>
            <p>Your order has been placed.</p>
          </div>
        </div>
      )}
    </div>
  );
}
