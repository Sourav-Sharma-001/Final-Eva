import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./Components/Menu/Menu";
import Thanks from "./Components/Thanks/Thanks";
import PlaceOrder from "./Components/PlaceOrder/PlaceOrder";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/place-order" element={<PlaceOrder />} />
      <Route path="/thanks" element={<Thanks />} />
    </Routes>
  );
}
