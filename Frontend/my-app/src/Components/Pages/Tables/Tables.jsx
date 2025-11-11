import React, { useState, useEffect, useRef } from "react";
import "./Tables.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiChairLight } from "react-icons/pi";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTable, setNewTable] = useState({ name: "", chairs: 3 });
  const modalRef = useRef(null);

  // ✅ Fetch all tables
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tables");
      setTables(res.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  // ✅ Remove manual tables only
  const removeTable = async (id) => {
    try {
      const table = tables.find((t) => t._id === id);
      if (table?.type === "dine-in") {
        alert("Cannot delete reserved dine-in table.");
        return;
      }
      await axios.delete(`http://localhost:5000/api/tables/${id}`);
      fetchTables();
    } catch (err) {
      console.error("Error deleting table:", err);
    }
  };

  // ✅ Create new manual table (API-connected)
const createTable = async () => {
  if (tables.length >= 30) return alert("Maximum table limit reached (30)");

  try {
    await axios.post("http://localhost:5000/api/tables", {
      name: newTable.name,
      chairs: newTable.chairs,
    });
    fetchTables();
    setShowModal(false);
    setNewTable({ name: "", chairs: 3 });
  } catch (err) {
    console.error("Error creating table:", err);
  }
};


  function handleBackdropClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
    }
  }

  return (
    <div className="tables-page">
      <header className="tables-header">
        <h1>Tables</h1>
      </header>

      <main className="tables-main">
        <ul className="tables-grid">
          {tables.map((t) => (
            <li
              key={t._id}
              className={`table-card ${t.isReserved ? "reserved" : ""}`}
            >
              {/* Delete only manual tables */}
              {!t.isReserved && (
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTable(t._id);
                  }}
                >
                  <RiDeleteBin6Line />
                </button>
              )}

              <div className="table-content">
                <div className="table-label">{t.type === "manual" ? t.name || "Table" : "Reserved"}</div>
                <div className="table-number">
                  {String(t.tableNumber).padStart(2, "0")}
                </div>
              </div>

              <div className="table-footer">
                <PiChairLight />
                {String(t.chairs).padStart(2, "0")}
              </div>
            </li>
          ))}

          {/* Add new table card */}
          <li className="table-card add-card" onClick={() => setShowModal(true)}>
            <div className="add-plus">+</div>
          </li>
        </ul>
      </main>

      {/* Create Table Modal */}
      {showModal && (
        <div
          onClick={handleBackdropClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            ref={modalRef}
            style={{
              background: "#eef2f1",
              borderRadius: "12px",
              padding: "1.5rem",
              width: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              textAlign: "center",
            }}
          >
            <label style={{ fontSize: "0.9rem", color: "#333" }}>
              Table name (optional)
            </label>
            <input
              type="text"
              value={newTable.name}
              onChange={(e) =>
                setNewTable({ ...newTable, name: e.target.value })
              }
              style={{
                border: "none",
                background: "transparent",
                borderBottom: "1px dashed #aaa",
                fontSize: "2rem",
                textAlign: "center",
                outline: "none",
              }}
            />

            <label style={{ fontSize: "0.9rem", color: "#333" }}>Chair</label>
            <select
              value={newTable.chairs}
              onChange={(e) =>
                setNewTable({
                  ...newTable,
                  chairs: parseInt(e.target.value),
                })
              }
              style={{
                borderRadius: "6px",
                padding: "0.25rem",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              {[2, 4, 6, 8].map((c) => (
                <option key={c} value={c}>
                  {String(c).padStart(2, "0")}
                </option>
              ))}
            </select>

            <button
              style={{
                background: "#333",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
              onClick={createTable} 
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
