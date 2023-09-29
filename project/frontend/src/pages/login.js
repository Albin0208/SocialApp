import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { baseUrl } from "../shared";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    const response = await fetch(baseUrl + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Send cookies along with the request
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Login failed.", data);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
            size="lg"
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            size="lg"
          />
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button className="mx-auto" variant="primary" type="submit" size="lg">
            Log in
          </Button>
        </div>
      </Form>
      <hr />
      <Row>
        <Col>
          <p className="text-center">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </Col>
      </Row>
    </>
  );
};
