import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <Container className="my-5">
      <Row className="mx-auto w-100">
        <Col className="mx-auto" md={7} lg={5}>
          <div className="p-5 rounded bg-light">
            <h2 className="mb-4 text-center">Social App</h2>
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
