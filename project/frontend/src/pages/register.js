import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 rounded bg-light">
        <h2 className="mb-4 text-center">Social App</h2>
        <Form>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" size="lg" />
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" size="lg" />
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" size="lg" />
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
