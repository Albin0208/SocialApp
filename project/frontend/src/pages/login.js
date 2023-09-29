import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap"; // Import Alert component
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../shared";
import { useForm } from "react-hook-form";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState(""); // State to hold the error message
  const navigate = useNavigate();

  const onSubmit = async data => {
    const response = await fetch(baseUrl + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("Login successful!", responseData);
      return navigate("/");
    } else {
      setError(responseData.error); // Set the error message from the backend
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            autoComplete="username"
            placeholder="Username"
            size="lg"
            {...register("username", {
              required: "Username is required",
            })}
            isInvalid={errors.username}
          />
          {errors.username && (
            <Form.Text className="text-danger">
              {errors.username.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            size="lg"
            {...register("password", {
              required: "Password is required",
            })}
            isInvalid={errors.password}
          />
          {errors.password && (
            <Form.Text className="text-danger">
              {errors.password.message}
            </Form.Text>
          )}
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
            Don't have an account? <Link to="/auth/register">Sign Up</Link>
          </p>
        </Col>
      </Row>
    </>
  );
};
