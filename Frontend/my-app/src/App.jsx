import { Routes, Route, Navigate } from "react-router-dom";
import Analytics from "./Components/Pages/Analytics/Analytics";
import Sidebar from "./Components/Sidebar/Sidebar";
import "./App.css"; // optional: if you have styles for App
import Tables from "./Components/Pages/Tables/Tables";

function App() {
  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="pages-container">
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
