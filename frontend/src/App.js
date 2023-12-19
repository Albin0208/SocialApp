import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login.js"; // import the Login component
import { Register } from "./pages/Register.js"; // import the Register component
import { Home } from "./pages/Home.js"; // import the Home component
import { MainLayout } from "./components/MainLayout.jsx";
import { AuthLayout } from "./components/AuthLayout.jsx";
import { ProtectedRoutes } from "./utils/ProtectedRoutes.jsx";
import { AuthProvider } from "./utils/AuthContext";
import { Profile } from "./pages/Profile.js";
import { NotFound } from "./pages/NotFound.js";
import { Friends } from "./pages/Friends.js";
import { Chat } from "./pages/Chat.js";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="profile/:id?" element={<Profile />} />
            <Route path="friends/:tab?" element={<Friends />} />
            <Route path="chat/:id" element={<Chat />} />
          </Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};
export default App;
