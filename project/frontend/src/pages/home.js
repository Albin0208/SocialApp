import { Card, Container } from "react-bootstrap";
import { baseUrl } from "../shared";
import { useEffect, useState } from "react";
import { CreatePost } from "../components/createPost.jsx";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await fetch(baseUrl + "posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies along with the request
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
      setIsLoading(false); // Mark loading as complete
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false); // Mark loading as complete even in case of an error
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(baseUrl + "posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies along with the request
        body: JSON.stringify({
          content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent("");
        fetchPosts();
      } else {
        console.error("Post creation failed.", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
        <p className="text-center">Welcome to the Social App!</p>
        <CreatePost
          handleSubmit={handleSubmit}
          content={content}
          setContent={setContent}
        />
        <hr />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Container className="w-100 p-0">
            {posts.map(post => (
              <Card className="mb-3 w-100">
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>{post.content}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Container>
        )}
    </>
  );
};
