import { Container, Image } from "react-bootstrap";

export const Home = () => {
  return (
    <>
      <Container className="w-100 p-0">
        <h4>
          Welcome to the Social App. This is a demo app to showcase the MERN stack.
          <Image src="https://www.rlogical.com/wp-content/uploads/2020/12/MERN.webp" alt="MERN stack" />
        </h4>
      </Container>
    </>
  );
};
