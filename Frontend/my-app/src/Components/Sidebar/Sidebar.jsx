import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaStream, FaChartBar } from "react-icons/fa";
import { LuArmchair } from "react-icons/lu";
import { MdOutlineSpaceDashboard } from "react-icons/md";

import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <aside className="sidebar">
      <img
        src="https://www.logologo.com/logos/abstract-isometric-logo-design-free-logo.jpg"
        alt="logo"
        className="logo"
      />

      <nav>
        <ul>

          <li className={pathname === "/" ? "active" : ""}>
            <Link to="/">
              <MdOutlineSpaceDashboard />
            </Link>
          </li>

          <li className={pathname === "/tables" ? "active" : ""}>
            <Link to="/tables">
              <LuArmchair />
            </Link>
          </li>

          <li className={pathname === "/orderLine" ? "active" : ""}>
            <Link to="/orderLine">
              <FaStream />
            </Link>
          </li>

          <li className={pathname === "/foodItems" ? "active" : ""}>
            <Link to="/foodItems">
              <FaChartBar />
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
}
