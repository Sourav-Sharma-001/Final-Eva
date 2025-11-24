import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Analytics.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";


export default function Analytics() {
  const [orderStats, setOrderStats] = useState({
    served: 0,
    dineIn: 0,
    takeAway: 0,
    totalOrders: 0,
  });
  const [revenue, setRevenue] = useState(0);
  const [revenueChart, setRevenueChart] = useState([]);
  const [reservedTables, setReservedTables] = useState([]);
  const [chefsLive, setChefsLive] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [filter, setFilter] = useState("Daily");
  const [revenueFilter, setRevenueFilter] = useState("Daily");

  const BASE_URL = import.meta.env.VITE_API_URL;

  const tables = Array.from({ length: 30 }, (_, i) => i + 1);

  const formatNumber = (num) => String(num).padStart(2, "0");
  const formatRevenue = (amount) =>
    amount >= 1000 ? `${Math.floor(amount / 1000)}K` : amount;

  // Function to fetch orders based on filter
  const fetchOrders = async () => {
    try {
      // 1) fetch filtered data (daily/weekly/monthly) or lifetime if filter not matched
      let url = `${BASE_URL}/api/analytics/orders`;
      if (filter === "Daily")
        url = `${BASE_URL}/api/analytics/orders/daily`;
      if (filter === "Weekly")
        url = `${BASE_URL}/api/analytics/orders/weekly`;
      if (filter === "Monthly")
        url = `${BASE_URL}/api/analytics/orders/monthly`;

      const res = await axios.get(url);
      const filtered = res.data || {
        served: 0,
        dineIn: 0,
        takeAway: 0,
        totalOrders: 0,
      };

      // 2) always fetch lifetime totals separately and preserve it
      const totalRes = await axios.get(
        `${BASE_URL}/api/analytics/orders`
      );
      const lifetime = totalRes.data || { totalOrders: 0 };

      // 3) update state: use filtered served/dineIn/takeAway but KEEP lifetime totalOrders
      setOrderStats({
        served: filtered.served || 0,
        dineIn: filtered.dineIn || 0,
        takeAway: filtered.takeAway || 0,
        totalOrders: lifetime.totalOrders || 0,
      });
    } catch (err) {
      console.error(err);
      setOrderStats({ served: 0, dineIn: 0, takeAway: 0, totalOrders: 0 });
    }
  };

  const fetchRevenueChart = async () => {
    try {
      let url = `${BASE_URL}/api/analytics/revenue/daily-chart`;
      if (revenueFilter === "Weekly")
        url = `${BASE_URL}/api/analytics/revenue/weekly-chart`;
      if (revenueFilter === "Monthly")
        url = `${BASE_URL}/api/analytics/revenue/monthly-chart`;

      const res = await axios.get(url);
      const amount = Number(res.data?.amount || 0);
      const label =
        revenueFilter === "Daily"
          ? "Today"
          : revenueFilter === "Weekly"
          ? "Last 7 days"
          : "This month";

      // Put a single-item array (Option A: single bar)
      setRevenueChart([{ label, amount }]);
    } catch (err) {
      console.error(err);
      setRevenueChart([]);
    }
  };

  useEffect(() => {
    fetchOrders(); // fetch orders whenever filter changes
    fetchRevenueChart();

    // Revenue
    axios
      .get(`${BASE_URL}/api/analytics/revenue`)
      .then((res) => setRevenue(Number(res.data.amount)))
      .catch(() => setRevenue(0));

    // Tables
    axios
      .get(`${BASE_URL}/api/analytics/tables`)
      .then((res) => {
        const reserved = Array.isArray(res?.data?.reserved)
          ? res.data.reserved
          : [];
        setReservedTables(reserved.map((r) => Number(r)));
      })
      .catch(() => setReservedTables([]));

    // Chefs live
    axios
      .get(`${BASE_URL}/api/analytics/chefs-live`)
      .then((res) => {
        const arr = Array.isArray(res?.data) ? res.data : [];
        setChefsLive(
          arr.map((c) => ({
            chefName: c.chefName || "Unassigned",
            liveOrders: Number(c.liveOrders) || 0,
          }))
        );
      })
      .catch(() => setChefsLive([]));

    // Total clients
    axios
      .get(`${BASE_URL}/api/analytics/total-clients`)
      .then((res) => setTotalClients(res.data.totalClients || 0))
      .catch(() => setTotalClients(0));
  }, [filter, revenueFilter]);

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
            <h3>{totalClients}</h3>
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
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
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

          {/* Order Summary Dynamic Visualization */}
          <div className="pie-dynamic">
            {/* Pie Circle – Active Orders Only */}
            <div
              className="circle-dynamic"
              style={{
                background: `conic-gradient(
                  #ff9800 0deg ${
                    ((orderStats.takeAway || 0) /
                      ((orderStats.takeAway || 0) + (orderStats.dineIn || 0))) *
                      360 || 0
                  }deg,
                  #2196f3 ${
                    ((orderStats.takeAway || 0) /
                      ((orderStats.takeAway || 0) + (orderStats.dineIn || 0))) *
                      360 || 0
                  }deg 360deg
                )`,
              }}
            ></div>

            {/* Bars */}
            <div className="bar-dynamic">
              {/* Active Orders */}
              {["takeAway", "dineIn"].map((type) => {
                const value = orderStats[type] || 0;
                const totalActive =
                  (orderStats.takeAway || 0) + (orderStats.dineIn || 0);
                const percent = totalActive
                  ? Math.round((value / totalActive) * 100)
                  : 0;
                const label = type === "takeAway" ? "Take Away" : "Dine In";
                const color = type === "takeAway" ? "#ff9800" : "#2196f3";
                return (
                  <div className="bar-block-dynamic" key={type}>
                    <span className="bar-label">{label}</span>
                    <span className="bar-percent">({percent}%)</span>
                    <div
                      className="bar-line-dynamic"
                      style={{ width: `${percent}%`, background: color }}
                    ></div>
                  </div>
                );
              })}

              {/* Served Orders – Separate Bar */}
              <div className="bar-block-dynamic">
                <span className="bar-label">Served</span>
                <span className="bar-percent">({orderStats.served || 0})</span>
                <div
                  className="bar-line-dynamic"
                  style={{
                    width: `${
                      orderStats.totalOrders
                        ? Math.round(
                            (Number(orderStats.served || 0) /
                              Number(orderStats.totalOrders)) *
                              100
                          )
                        : 0
                    }%`,
                    background: "#4caf50",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

       {/* Revenue */}
<div className="revenue card">
  <div className="header">
    <h4>Revenue</h4>
    <select
      value={revenueFilter}
      onChange={(e) => setRevenueFilter(e.target.value)}
    >
      <option>Daily</option>
      <option>Weekly</option>
      <option>Monthly</option>
    </select>
  </div>

  <p className="desc">Revenue trends over the week</p>

  <div
    className="chart-flex"
    style={{ width: "100%", height: "14rem" }}
  >
    <ResponsiveContainer width="100%" aspect={3}>
      <LineChart data={revenueChart}>
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* FIXED: your x-axis uses `label`, not `day` */}
        <XAxis dataKey="label" />

        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="amount"
          stroke="#4e79a7"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
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
                  Array.isArray(reservedTables) && reservedTables.includes(t)
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
