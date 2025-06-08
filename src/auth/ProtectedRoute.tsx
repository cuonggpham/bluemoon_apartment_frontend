import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../utils/authUtils";

const ProtectedRoute = () => {
  // Check if accessToken exists and is not expired
  const token = localStorage.getItem("accessToken");  
  
  if (!token || isTokenExpired()) {
    // Clear expired token and redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    return <Navigate to="/signin" replace />;
  }

  // Otherwise, allow the child route to render
  return <Outlet />;
};

export default ProtectedRoute;