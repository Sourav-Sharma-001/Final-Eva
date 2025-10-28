import React, { useState, useRef, useEffect } from "react";
import "./PlaceOrder.css";

export default function PlaceOrder() {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("dinein");
  const [ordered, setOrdered] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [noteValue, setNoteValue] = useState("");

  const trackRef = useRef(null);
  const knobRef = useRef(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const trackWidthRef = useRef(1);
  const knobWidthRef = useRef(1);
  const startProgressRef = useRef(0);

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
        setSwipeProgress(p => Math.min(1, Math.max(0, p)));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = (e) => {
    if (ordered) return;
    draggingRef.current = true;
    startProgressRef.current = swipeProgress;
    const clientX = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
    startXRef.current = clientX;
    try { e.target.setPointerCapture?.(e.pointerId); } catch {}
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current || ordered) return;
    const clientX = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
    const dx = clientX - startXRef.current;
    const maxTravel = Math.max(1, trackWidthRef.current - knobWidthRef.current - 6);
    let newLeft = startProgressRef.current * maxTravel + dx;
    newLeft = Math.max(0, Math.min(maxTravel, newLeft));
    setSwipeProgress(newLeft / maxTravel);
  };

  const onPointerUp = (e) => {
    if (!draggingRef.current || ordered) return;
    draggingRef.current = false;
    const threshold = 0.72;
    if (swipeProgress >= threshold) {
      setSwipeProgress(1);
      setOrdered(true);
    } else {
      setSwipeProgress(0);
    }
    try { e.target.releasePointerCapture?.(e.pointerId); } catch {}
  };

  const handleSetOrderType = (type) => {
    if (ordered) return;
    setOrderType(type);
  };

  const handleNext = () => {
    const input = document.querySelector(".cooking-note");
    if (input) input.value = noteValue;
    setShowPopup(false);
  };

  const itemTotal = 200 * quantity;
  const deliveryCharge = 50;
  const taxes = 5;
  const grandTotal = itemTotal + (orderType === "takeaway" ? deliveryCharge : 0) + taxes;

  const knobTranslateX = () => {
    const maxTravel = Math.max(1, trackWidthRef.current - knobWidthRef.current - 6);
    return swipeProgress * maxTravel;
  };

  return (
    <div className="order-wrapper">

      <div className="order-page">
        <div className="top-area">
          <h2 className="greeting">Good evening</h2>
          <p className="sub-text">Place you order here</p>
        </div>

        <div className="search-box">
          <input type="text" placeholder="Search" aria-label="Search" />
        </div>

        <div className="item-card">
          <div className="img-wrap">
            <img
              src="/mnt/data/Group 625043.png"
              alt="pizza"
              className="item-img"
            />
          </div>

          <div className="item-info">
            <div className="item-header">
              <h3 className="item-title">Marinara</h3>
              <button className="remove-btn" aria-label="Remove item">✖</button>
            </div>

            <p className="price">₹ {itemTotal}</p>

            <div className="qty-row">
              <div className="qty-selector">
                <button onClick={() => setQuantity(q => (q > 1 ? q - 1 : 1))} className="qty-btn">-</button>
                <div className="qty-value">{quantity}</div>
                <button onClick={() => setQuantity(q => q + 1)} className="qty-btn">+</button>
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

        <div className="order-type">
          <button
            className={`seg-btn ${orderType === "dinein" ? "active" : ""}`}
            onClick={() => handleSetOrderType("dinein")}
          >
            Dine In
          </button>
          <button
            className={`seg-btn ${orderType === "takeaway" ? "active" : ""}`}
            onClick={() => handleSetOrderType("takeaway")}
          >
            Take Away
          </button>
        </div>

        <div className="bill-box">
          <div className="bill-row"><span>Item Total</span><span>₹{itemTotal.toFixed(2)}</span></div>

          {orderType === "takeaway" && (
            <div className="bill-row"><span>Delivery Charge</span><span>₹{deliveryCharge.toFixed(2)}</span></div>
          )}

          <div className="bill-row"><span>Taxes</span><span>₹{taxes.toFixed(2)}</span></div>

          <div className="total-row"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
        </div>

        {orderType === "takeaway" && (
          <div className="details-block">
            <h4 className="details-title">Your details</h4>
            <p className="user-name">Divya Sigatapu, 9109109109</p>

            <div className="address-box">
              <span className="address-pin">📍</span>
              <span className="address-text">Delivery at Home - Flat no: 301, SVR Enclave, Hyper Nagar, vasavi...</span>
            </div>

            <div className="delivery-time">
              <span className="time-pin">⏱</span>
              <span>Delivery in <strong>42 mins</strong></span>
            </div>
          </div>
        )}
      </div>

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
              <button className="popup-cancel" onClick={() => {
                setNoteValue("");
                setShowPopup(false);
              }}>
                Cancel
              </button>
              <button className="popup-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
