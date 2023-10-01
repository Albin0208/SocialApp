import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap"; // Import Alert component
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../utils/AuthContext";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { token, loginUser, error } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  const onSubmit = async data => {
    try {
      await loginUser(data); // Use the loginUser function from AuthContext
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </Col>
      </Row>
    </>
  );
};
