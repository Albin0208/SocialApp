import { Form, Button, Row, Col, Alert } from "react-bootstrap"; // Import Alert component
import { Link } from "react-router-dom";
import { baseUrl } from "../shared";
import { useForm } from "react-hook-form";
import { useState } from "react";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [error, setError] = useState("");

  const onSubmit = async data => {
    // Send the registration data to the server
    try {
      const response = await fetch(baseUrl + "user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Registration successful, you can handle the response here
        console.log("Registration successful!");
        // TODO redirect to login page or login automatically
      } else {
        // Registration failed, handle error or show a message
        const errorData = await response.json();
        setError(errorData.error); // Set the error message from the backend
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
              minLength: {
                value: 3,
                message: "Username should be at least 3 characters long",
              },
            })}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">
            {errors.username && errors.username.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            size="lg"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password should be at least 6 characters long",
              },
            })}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password && errors.password.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-4">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            size="lg"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: value =>
                value === watch("password") || "Passwords do not match",
            })}
            isInvalid={!!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword && errors.confirmPassword.message}
          </Form.Control.Feedback>
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
          <p className="text-center">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </Col>
      </Row>
    </>
  );
};
