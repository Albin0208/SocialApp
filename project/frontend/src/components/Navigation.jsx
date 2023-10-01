import { Navbar, Nav, Button } from "react-bootstrap";
import { useAuth } from "../utils/AuthContext";

export const Navigation = () => {
  const { logoutUser } = useAuth();

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Social App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Button variant="primary" onClick={logoutUser}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <hr />
    </>
  );
};
