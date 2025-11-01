import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./ContextAPI/CartContext.jsx";
import { Toaster } from "react-hot-toast"; // 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster position="top-center" reverseOrder={false} /> 
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
