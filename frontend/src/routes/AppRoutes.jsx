import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import Customers from "../pages/customers/Customers";
import Orders from "../pages/orders/Orders";
import CreateOrder from "../pages/orders/CreateOrder";

import ProtectedRoute from "../components/protected/ProtectedRoute";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/create"
          element={
            <ProtectedRoute>
              <CreateOrder />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
