import React, { useState } from "react";
import "./Tables.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiChairLight } from "react-icons/pi";

export default function Tables() {
  const initial = Array.from({ length: 30 }, (_, i) => i + 1);
  const [tables, setTables] = useState(initial);

  function removeTable(n) {
    setTables((prev) => prev.filter((x) => x !== n));
  }

  function addTable() {
    const next = (tables.length ? Math.max(...tables) : 0) + 1;
    setTables((prev) => [...prev, next]);
  }

  return (
    <div className="tables-page">
      <header className="tables-header">
        <h1>Tables</h1>
      </header>

      <main className="tables-main">
        <ul className="tables-grid" role="list" aria-label="Tables list">
          {tables.map((n) => (
            <li key={n} className="table-card" role="listitem" tabIndex={0}>
              <button
                className="delete-btn"
                aria-label={`Delete table ${String(n).padStart(2, "0")}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeTable(n);
                }}
              >
                <RiDeleteBin6Line />
              </button>

              <div className="table-content">
                <div className="table-label">Table</div>
                <div className="table-number">{String(n).padStart(2, "0")}</div>
              </div>

              <div className="table-footer">
                <PiChairLight />
                03
              </div>
            </li>
          ))}

          {/* add tile */}
          <li
            className="table-card add-card"
            role="button"
            tabIndex={0}
            onClick={addTable}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && addTable()
            }
            aria-label="Add table"
          >
            <div className="add-plus">+</div>
          </li>
        </ul>
      </main>
    </div>
  );
}
