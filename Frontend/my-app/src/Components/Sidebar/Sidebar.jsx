import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaStream, FaChartBar } from "react-icons/fa";
import { LuArmchair } from "react-icons/lu";
import { MdOutlineSpaceDashboard } from "react-icons/md";


import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <img
        src="https://www.logologo.com/logos/abstract-isometric-logo-design-free-logo.jpg"
        alt="logo"
        className="logo"
      />
      <nav>
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">
              <MdOutlineSpaceDashboard />
            </Link>
          </li>
          <li className={location.pathname === "/tracer" ? "active" : ""}>
            <Link to="/tables">
              <LuArmchair />
            </Link>
          </li>
          <li className={location.pathname === "/analysis" ? "active" : ""}>
            <Link to="/orderLine">
              <FaStream />
            </Link>
          </li>
          <li className={location.pathname === "/config" ? "active" : ""}>
            <Link to="/foodItems">
              <FaChartBar />
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
