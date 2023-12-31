import useAxiosPrivate from "../utils/useAxiosPrivate";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export const PostCard = ({ post }) => {
  const [author, setAuthor] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchAuthor = async () => {
    try {
      const response = await axiosPrivate.get("user/" + post.author, {
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

  const formatDate = timestamp => {
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
        <Card.Header
          as={Link}
          to={"/profile/" + author?._id}
          style={{ textDecoration: "none" }}
        >
          {author ? author.username : "Loading..."}
        </Card.Header>
        <Card.Body>
          <Card.Text>{post.content}</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
          {formatDate(post.createdAt)}
        </Card.Footer>
      </Card>
    </>
  );
};
