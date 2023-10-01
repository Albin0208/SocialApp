import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  // TODO Add check if JWT token is valid
  const user = false;
  return user ? <Outlet /> : <Navigate to="/auth/login" />;

}