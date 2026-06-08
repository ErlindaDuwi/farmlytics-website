import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import MasterData from "./pages/MasterData";
import AuditLog from "./pages/AuditLog";
import DashboardPublic from "./pages/DashboardPublic";

function ProtectedRoute({ children }) {
  const isAuthenticated =
    localStorage.getItem("login") === "true";

  if (!isAuthenticated) {
    alert("Silakan login terlebih dahulu");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("login") === "true";
    setIsLogin(loginStatus);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<DashboardPublic />} />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login setIsLogin={setIsLogin} />}
        />

        {/* DASHBOARD ADMIN*/}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard setIsLogin={setIsLogin} />
            </ProtectedRoute>
          }
        >
          {/* 🔥 INI ISI HALAMAN */}
          <Route path="users" element={<Users />} />
          <Route path="master-data" element={<MasterData />} />
          <Route path="audit-log" element={<AuditLog />} />
        </Route>

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
