import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Analytics.css";

export default function Analytics() {
  const [orderStats, setOrderStats] = useState({
    served: 0,
    dineIn: 0,
    takeAway: 0,
    totalOrders: 0,
  });
  const [revenue, setRevenue] = useState(0);
  const [reservedTables, setReservedTables] = useState([]);
  const [chefsLive, setChefsLive] = useState([]);

  const tables = Array.from({ length: 30 }, (_, i) => i + 1);

  const formatNumber = (num) => String(num).padStart(2, "0");
  const formatRevenue = (amount) =>
    amount >= 1000 ? `${Math.floor(amount / 1000)}K` : amount;

  useEffect(() => {
    axios
      .get("/api/analytics/orders")
      .then((res) => setOrderStats(res.data))
      .catch((err) => console.error(err));

    axios
      .get("/api/analytics/revenue")
      .then((res) => setRevenue(res.data.amount))
      .catch((err) => console.error(err));

    axios
      .get("/api/analytics/tables")
      .then((res) => setReservedTables(res.data.reserved))
      .catch((err) => console.error(err));

    axios
      .get("/api/analytics/chefs-live")
      .then((res) => setChefsLive(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="analytics-container">
      <input className="search-input" placeholder="Filter..." />
      <h2 className="title">Analytics</h2>

      {/* ==== TOP STATS BOXES ==== */}
      <div className="stats">
        <div className="stat-box">
          <div className="icon">🍳</div>
          <div>
          <h3>{formatNumber(4 - chefsLive.length)}</h3>
            <p>Total Chef</p>
          </div>
        </div>

        <div className="stat-box">
          <div className="icon">💰</div>
          <div>
            <h3>{formatRevenue(revenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-box">
          <div className="icon">📦</div>
          <div>
            <h3>{formatNumber(orderStats.totalOrders)}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-box">
          <div className="icon">👥</div>
          <div>
            <h3>65</h3>
            <p>Total Clients</p>
          </div>
        </div>
      </div>

      {/* ==== MIDDLE SECTION (3 cards) ==== */}
      <div className="middle-section">
        {/* Order Summary */}
        <div className="order-summary card">
          <div className="header">
            <h4>Order Summary</h4>
            <select>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <p className="desc">Summary of order types</p>

          <div className="order-stats">
            <div>
              <h3>{formatNumber(orderStats.served)}</h3>
              <p>Served</p>
            </div>
            <div>
              <h3>{formatNumber(orderStats.dineIn)}</h3>
              <p>Dine In</p>
            </div>
            <div>
              <h3>{formatNumber(orderStats.takeAway)}</h3>
              <p>Take Away</p>
            </div>
          </div>

          {/* PIE stays same - not dynamic */}
          <div className="pie">
            <div className="circle"></div>
            <div className="bar">
              <div className="bar-block">
                <div>Take Away </div>
                <div>(24%)</div>
                <div className="bar-line"></div>
              </div>
              <div className="bar-block">
                <div>Dine In </div>
                <div>(38%)</div>
                <div className="bar-line"></div>
              </div>
              <div className="bar-block">
                <div>Served </div>
                <div>(48%)</div>
                <div className="bar-line"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="revenue card">
          <div className="header">
            <h4>Revenue</h4>
            <select>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <p className="desc">Revenue trends over the week</p>

          <div className="graph">
            <div className="line"></div>
          </div>
        </div>

        {/* Tables */}
        <div className="tables card">
          <h4>Tables</h4>

          <div className="legend">
            <span className="dot reserved"></span> Reserved
            <span className="dot available"></span> Available
          </div>

          <div className="table-grid">
            {tables.map((t) => (
              <div
                key={t}
                className={`table ${
                  Array.isArray(reservedTables) &&
                  reservedTables.includes(t)
                    ? "reserved"
                    : "available"
                }`}
              >
                Table {String(t).padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==== CHEF TABLE LAST ==== */}
      <div className="chef-table card">
        <table>
          <thead>
            <tr>
              <th>Chef Name</th>
              <th>Order Taken</th>
            </tr>
          </thead>
          <tbody>
            {chefsLive.map((c, i) => (
              <tr key={i}>
                <td>{c.chefName}</td>
                <td>{formatNumber(c.liveOrders)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
