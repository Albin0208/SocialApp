import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <Container className="my-5">
      <div className="p-5 rounded bg-light">
        <h2 className="mb-4 text-center">Social App</h2>
        <Outlet />
      </div>
    </Container>
  );
};
