import { Button, Form } from "react-bootstrap";

export const CreatePost = ({ handleSubmit, content, setContent }) => {
  return (
    <>
      <Form onSubmit={handleSubmit} id="create_post_id">
        <Form.Group controlId="content" className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            type="text"
            placeholder="Content"
            size="lg"
            value={content}
            onChange={e => {
              setContent(e.target.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>
    </>
  );
};
