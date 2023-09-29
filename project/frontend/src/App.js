import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login.js"; // import the Login component
import { Register } from "./pages/register.js"; // import the Register component
import { Home } from "./pages/home.js"; // import the Home component
import { MainLayout } from "./components/mainLayout.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <MainLayout>
                <h1>Not Found!</h1>
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default App;
