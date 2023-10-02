import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useAuth } from "../utils/AuthContext";
import { NavLink } from "react-router-dom";

export const Navigation = () => {
  const { logoutUser } = useAuth();

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Social App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={NavLink} to={"/"}>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to={"/friends"}>
              Friends
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <NavDropdown title={"Profile"} id="basic-nav-dropdown">
              <NavDropdown.Item as={NavLink} to={"/profile"}>
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to={"/settings"}>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logoutUser}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <hr />
    </>
  );
};
