import React from "react";
import "./Analytics.css";

export default function Analytics() {
  const chefs = [
    { name: "Manesh", orders: 3 },
    { name: "Pritam", orders: 7 },
    { name: "Yash", orders: 5 },
    { name: "Tenzen", orders: 8 },
  ];

  const tables = Array.from({ length: 30 }, (_, i) => i + 1);
  const reservedTables = [4, 5, 6, 7, 22, 23, 29, 30];

  return (
    <div className="analytics-container">
      <h2 className="title">Analytics</h2>

      <div className="stats">
        <div className="stat-box">
          <div className="icon">🍳</div>
          <div>
            <h3>04</h3>
            <p>Total Chef</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="icon">💰</div>
          <div>
            <h3>12K</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="icon">📦</div>
          <div>
            <h3>20</h3>
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

      <div className="middle-section">
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
              <h3>09</h3>
              <p>Served</p>
            </div>
            <div>
              <h3>05</h3>
              <p>Dine In</p>
            </div>
            <div>
              <h3>06</h3>
              <p>Take Away</p>
            </div>
          </div>
          <div className="pie">
            <div className="circle"></div>
            <div className="bar">
              <div className="bar-block">
                <div>Take Away </div>
                <div>(24%)</div>
                <div className="bar-line"></div>
              </div>
              <div className="bar-block">
                <div>Take Away </div>
                <div>(24%)</div>
                <div className="bar-line"></div>
              </div>
              <div className="bar-block">
                <div>Take Away </div>
                <div>(24%)</div>
                <div className="bar-line"></div>
              </div>              
            </div>
          </div>
        </div>

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
                  reservedTables.includes(t) ? "reserved" : "available"
                }`}
              >
                Table {String(t).padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chef-table card">
        <table>
          <thead>
            <tr>
              <th>Chef Name</th>
              <th>Order Taken</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{String(c.orders).padStart(2, "0")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
