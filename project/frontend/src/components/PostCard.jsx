import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { baseUrl } from "../shared";

export const PostCard = ({ post }) => {
  const [author, setAuthor] = useState(null);
  console.log(post.author);

  const fetchAuthor = async () => {
    try {
      const response = await fetch(baseUrl + "user/" + post.author, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const authorData = await response.json();
        setAuthor(authorData); // Set the author data once fetched
      } else {
        // Handle errors if needed
        console.log(response);
        console.error("Error fetching author data");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("An error occurred while fetching author data", error);
    }
  };

  useEffect(() => {
    fetchAuthor(); // Fetch author data when the component mounts
  }, [post.author]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    return `${date.toISOString().substring(0, 10)} ${date.toLocaleTimeString(
      "se-SE",
      {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Stockholm",
        hour12: false,
      }
    )}`;
  };

  return (
    <>
      <Card className="mb-3 w-100" key={post._id}>
        <Card.Header>{author ? author.username : "Loading..."}</Card.Header>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>{post.content}</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
          {formatDate(post.createdAt)}
        </Card.Footer>
      </Card>
    </>
  );
};
