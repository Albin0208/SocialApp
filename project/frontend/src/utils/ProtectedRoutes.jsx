import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoutes = () => {
  // TODO Add check if JWT token is valid

  const { token } = useAuth();
  console.log(token);
  return token ? <Outlet /> : <Navigate to="/login" />;
};
