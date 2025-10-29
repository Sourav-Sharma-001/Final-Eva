import React from "react";
import { Routes, Route } from "react-router-dom";
import PlaceOrder from "./Components/placeOrder/placeOrder";
import Menu from "./Components/Menu/Menu";
import Thanks from "./Components/Thanks/Thanks";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/placeOrder" element={<PlaceOrder />} />
      <Route path="/thanks" element={<Thanks />} />
    </Routes>
  );
}
