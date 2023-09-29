import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { baseUrl } from "../shared";

export const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();

    const response = await fetch(baseUrl + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      
    } else {
      console.error("Login failed.", data);
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="p-5 rounded bg-light">
          <h2 className="mb-4 text-center">Social App</h2>
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
              <Button
                className="mx-auto"
                variant="primary"
                type="submit"
                size="lg"
              >
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
        </div>
      </Container>
    </>
  );
};
