import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login.js"; // import the Login component
import { Register } from "./pages/register.js"; // import the Register component
import { Home } from "./pages/home.js"; // import the Home component
import { MainLayout } from "./components/mainLayout.jsx";
import { AuthLayout } from "./components/authLayout.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="auth/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<h1>Not Found!</h1>} />
      </Routes>
    </>
  );
};
export default App;
