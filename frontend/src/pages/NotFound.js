import { Container } from "react-bootstrap";

export const NotFound = () => {
  return (
    <Container className="my-5">
      <div className="p-5 rounded bg-light">
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </Container>
  );
};
