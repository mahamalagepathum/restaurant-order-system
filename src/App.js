import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RegisterPage       from "./pages/RegisterPage";
import LoginPage          from "./pages/LoginPage";
import DashboardPage      from "./pages/DashboardPage";
import CustomerOrderPage  from "./customer/CustomerOrderPage";
import Layout             from "./components/Layout";

// login access control routes
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// go to dashboard if already login
function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/register" element={
            <PublicRoute>
              <Layout><RegisterPage /></Layout>
            </PublicRoute>
          } />

          <Route path="/login" element={
            <PublicRoute>
              <Layout><LoginPage /></Layout>
            </PublicRoute>
          } />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><DashboardPage /></Layout>
            </PrivateRoute>
          } />

          <Route path="/order/:restaurantId" element={
            <Layout><CustomerOrderPage /></Layout>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}