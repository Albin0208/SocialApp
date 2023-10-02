import { Card } from "react-bootstrap";

export const PostCard = ({ post }) => {
  return (
    <>
      <Card className="mb-3 w-100" key={post._id}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>{post.content}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};
