import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login.js"; // import the Login component
import { Register } from "./pages/register.js"; // import the Register component
import { Home } from "./pages/home.js"; // import the Home component
import { Container } from "react-bootstrap";

const App = () => {
  return (
    <>
    <Container className="d-flex justify-content-center align-items-center my-5">
    <div className="p-5 rounded bg-light">
      <h2 className="mb-4 text-center">Social App</h2>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>Not Found!</h1>} />
      </Routes>
    </BrowserRouter>
    </div>
    </Container>
    </>
  );
};
export default App;
