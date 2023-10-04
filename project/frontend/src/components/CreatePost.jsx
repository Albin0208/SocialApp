import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

export const CreatePost = ({ handleSubmit, content, setContent }) => {
  return (
    <>
      <Form id="tweet_form" onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                as="textarea"
                id="tweet"
                style={{ resize: "none" }}
                placeholder="What's happening?"
                aria-label="With textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={1} className="ps-md-0 mt-2 mt-md-0">
            <Button className="h-100 w-100" type="submit" variant="primary">
              Post
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
