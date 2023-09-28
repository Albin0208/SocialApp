import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl } from "../shared";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the registration data
    const userData = {
      username,
      password,
    };

    // Send the registration data to the server
    try {
      const response = await fetch(baseUrl + "user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Registration successful, you can handle the response here
        console.log("Registration successful!");
      } else {
        // Registration failed, handle error or show a message
        console.error("Registration failed.", await response.json());
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 rounded bg-light">
        <h2 className="mb-4 text-center">Social App</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              size="lg"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              size="lg"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              size="lg"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </Form.Group>

          <div className="d-flex justify-content-center">
            <Button className="mx-auto" variant="primary" type="submit" size="lg">
              Register
            </Button>
          </div>
        </Form>
        <hr />
        <Row>
          <Col>
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </Col>
        </Row>
      </div>
    </Container>
  );
};
