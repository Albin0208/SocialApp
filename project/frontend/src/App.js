import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Login } from './pages/login.js'; // import the Login component
import { Register } from './pages/register.js'; // import the Register component

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;