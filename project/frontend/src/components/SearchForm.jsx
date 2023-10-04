import { Form, Row, Col, Button } from "react-bootstrap";

export const SearchForm = ({ content, setContent, handleSubmit }) => {
  return (
    <Form id="tweet_form" onSubmit={handleSubmit}>
      <Row>
        <Col md={11}>
          <Form.Group>
            <Form.Control
              type="text"
              id="tweet"
              style={{ resize: "none" }}
              placeholder="Find Friends..."
              aria-label="With textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={1} className="ps-md-0 mt-2 mt-md-0">
          <Button className="h-100 w-100" type="submit" variant="primary">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}