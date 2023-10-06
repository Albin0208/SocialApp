import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAuth } from "../utils/AuthContext";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();

  const { token, registerUser, error, successFulRegistration,reset } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
    reset();
  }, []);

  const onSubmit = async data => {
    try {
      await registerUser(data); // Use the registerUser function from AuthContext
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      {error.registerError && <Alert variant="danger">{error.registerError}</Alert>}
      {successFulRegistration && (
        <Alert variant="success">You have successfully registered</Alert>
      )}

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
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message:
                  "Username can only contain letters, numbers and underscore",
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
            autoComplete="new-password"
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
            autoComplete="new-password"
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
