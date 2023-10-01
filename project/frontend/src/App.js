import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login.js"; // import the Login component
import { Register } from "./pages/Register.js"; // import the Register component
import { Home } from "./pages/Home.js"; // import the Home component
import { MainLayout } from "./components/MainLayout.jsx";
import { AuthLayout } from "./components/AuthLayout.jsx";
import { ProtectedRoutes } from "./utils/ProtectedRoutes.jsx";

const App = () => {
  return (
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Route>
        <Route path="auth/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<h1>Not Found!</h1>} />
      </Routes>
  );
};
export default App;
