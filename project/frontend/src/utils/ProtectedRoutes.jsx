import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoutes = () => {
  const { token } = useAuth();
  console.log("token", token);
  return token ? <Outlet /> : <Navigate to="/login" />;
};
