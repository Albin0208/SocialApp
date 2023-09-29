import Container from 'react-bootstrap/Container';

export const MainLayout = ({ children }) => {

  return (
    <Container className="my-5">
      <div className="p-5 rounded bg-light">
        <h2 className="mb-4 text-center">Social App</h2>
        {children}
      </div>
    </Container>
  );
}