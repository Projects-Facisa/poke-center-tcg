import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login/Login.jsx";
import Controller from "./Controller/Controller.jsx";
import "./App.css";
import ProtectedRoute from "./components/protectedRoute/protectedRoute.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route
          path="/Admin"
          element={
            <ProtectedRoute>
              <Controller />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
