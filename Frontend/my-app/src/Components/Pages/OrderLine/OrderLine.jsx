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
    const interval = setInterval(fetchOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timers = orders.map((order) => {
      if (order.status === "processing" && order.totalPrepTime) {
        const endTime =
          new Date(order.orderTime).getTime() + order.totalPrepTime * 60000;

        const timer = setInterval(async () => {
          const remaining = endTime - new Date().getTime();
          if (remaining <= 0) {
            clearInterval(timer);
            try {
              const newStatus =
                order.orderType === "takeaway" ? "not picked up" : "served";

                if (order.orderType === "dine-in") {
                  await axios.put(`http://localhost:5000/api/orders/${order._id}`, {
                    status: newStatus,
                  });
                }                

              setOrders((prev) =>
                prev.map((o) =>
                  o._id === order._id ? { ...o, status: newStatus } : o
                )
              );
            } catch (err) {
              console.error("Error updating order:", err);
            }
          }
        }, 1000);

        return timer;
      }
      return null;
    });

    return () => timers.forEach((t) => t && clearInterval(t));
  }, [orders]);

  const formatTime = (target) => {
    if (!target) return "00:00";
    const targetTime = new Date(target).getTime();
    if (isNaN(targetTime)) return "00:00";
    const diff = targetTime - new Date().getTime();
    if (diff <= 0) return "00:00";

    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="order-line">
      <h2 className="title">Order Line</h2>
      <div className="order-grid">
        {orders.map((order, index) => {
          const color =
            order.status === "served" || order.status === "not picked up"
              ? order.orderType === "takeaway"
                ? "grey"
                : "green"
              : order.status === "processing"
              ? "orange"
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
                  <span>
                    {order.status === "processing"
                      ? formatTime(
                          new Date(order.orderTime).getTime() +
                            order.totalPrepTime * 60000
                        )
                      : order.status}
                  </span>
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
                  <button className="order-btn orange-btn">
                    Processing ⏳
                  </button>
                )}

                {(order.status === "served" ||
                  order.status === "not picked up") && (
                  <button
                    className={`order-btn ${
                      order.status === "not picked up"
                        ? "grey-btn"
                        : "green-btn"
                    }`}
                    onClick={async () => {
                      try {
                        // move to completed (best-effort)
                        await axios.post(
                          "http://localhost:5000/api/completed-orders",
                          order
                        );
                      } catch (err) {
                        console.warn("completed-orders POST failed:", err);
                      }

                      try {
                        // delete from active orders
                        await axios.delete(
                          `http://localhost:5000/api/orders/${order._id}`
                        );
                      } catch (err) {
                        console.error("Failed to delete order:", err);
                      }

                      // remove immediately from UI
                      setOrders((prev) =>
                        prev.filter((o) => o._id !== order._id)
                      );
                      console.log(`✅ Order ${order._id} removed`);
                    }}
                  >
                    Order Done ✓
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
