import React, { useEffect, useState } from "react";
import "./OrderLine.css";
import axios from "axios";

export default function OrderLine() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();

    // Optional: auto-refresh every 10s
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="order-line">
      <h2 className="title">Order Line</h2>
      <div className="order-grid">
        {orders.map((order, index) => {
          const color =
            order.status === "processing"
              ? "orange"
              : order.status === "served"
              ? "green"
              : "grey";

          return (
            <div key={index} className={`order-card ${color}`}>
              <div className="order-header">
                <div>
                  <div className="order-number">#{order.orderId}</div>
                  <div className="order-details">
                    {order.orderType === "dine-in"
                      ? `Table-${order.tableNumber}`
                      : order.orderType}
                  </div>
                  <div className="order-time">
                    {new Date(order.orderTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="order-items">
                    {order.items?.length || 0} Item
                    {order.items?.length > 1 ? "s" : ""}
                  </div>
                </div>

                <div className={`order-type ${color}-tag`}>
                  <p>{order.orderType}</p>
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="order-body">
                {order.items?.length > 0 && (
                  <>
                    <p className="meal-title">{order.items[0].name}</p>
                    <ul>
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="order-footer">
                {order.status === "processing" && (
                  <button className="order-btn orange-btn">Processing ⏳</button>
                )}
                {order.status === "served" && (
                  <button className="order-btn green-btn">Order Done ✅</button>
                )}
                {order.status === "not picked up" && (
                  <button className="order-btn grey-btn">Order Done ⚙️</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
