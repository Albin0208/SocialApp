import React from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

export const SearchForm = ({ content, setContent, handleSubmit }) => {
  return (
    <Form id="search_form" onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          id="search"
          style={{ resize: "none" }}
          placeholder="Find Friends..."
          aria-label="Find Friends"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!content} // Disable button when content is empty
        >
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};
