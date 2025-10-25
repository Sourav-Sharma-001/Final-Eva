import React from "react";
import "./OrderLine.css";

export default function OrderLine() {
  const orders = [
    { type: "Dine In", status: "Processing", color: "orange" },
    { type: "Done", status: "Served", color: "green" },
    { type: "Take Away", status: "Not Picked up", color: "grey" },
    { type: "Dine In", status: "Processing", color: "orange" },
    { type: "Dine In", status: "Processing", color: "orange" },
    { type: "Take Away", status: "Not Picked up", color: "grey" },
    { type: "Done", status: "Served", color: "green" },
    { type: "Dine In", status: "Processing", color: "orange" },
  ];

  return (
    <div className="order-line">
      <h2 className="title">Order Line</h2>
      <div className="order-grid">
        {orders.map((order, index) => (
          <div key={index} className={`order-card ${order.color}`}>
            <div className="order-header">
              <div>
                <div className="order-number">#108</div>
                <div className="order-details">Table-05</div>
                <div className="order-time">9:37 AM</div>
                <div className="order-items">3 Item</div>
              </div>
              <div className={`order-type ${order.color}-tag`}>
                <p>{order.type}</p>
                <span>{order.status}</span>
              </div>
            </div>

            <div className="order-body">
              <p className="meal-title">1x Value Set Meals</p>
              <ul>
                <li>1x Double Cheeseburger</li>
                <li>1x Apple Pie</li>
                <li>1x Coca-Cola L</li>
              </ul>
            </div>

            <div className="order-footer">
              {order.status === "Processing" && (
                <button className="order-btn orange-btn">Processing ⏳</button>
              )}
              {order.status === "Served" && (
                <button className="order-btn green-btn">Order Done ✅</button>
              )}
              {order.status === "Not Picked up" && (
                <button className="order-btn grey-btn">Order Done ⚙️</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
