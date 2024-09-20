import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Admin", { withCredentials: true })
      .then((response) => {
        if (response.data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/Login" />;
};

export default ProtectedRoute;
