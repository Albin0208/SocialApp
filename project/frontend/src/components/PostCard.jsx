
import axios from "axios";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { baseUrl } from "../shared";

export const PostCard = ({ post }) => {
  const [author, setAuthor] = useState(null);

  const fetchAuthor = async () => {
    try {
      const response = await axios.get(baseUrl + "user/" + post.author, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        const authorData = response.data;
        setAuthor(authorData);
      } else {
        console.error("Error fetching author data");
      }
    } catch (error) {
      console.error("An error occurred while fetching author data", error);
    }
  };

  useEffect(() => {
    fetchAuthor(); // Fetch author data when the component mounts
  }, []);

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
