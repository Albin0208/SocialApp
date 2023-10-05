import axios from "../api/axios";
import { Container } from "react-bootstrap";
import { baseUrl } from "../shared";
import { useEffect, useState } from "react";
import { CreatePost } from "../components/CreatePost.jsx";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../utils/AuthContext";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await axios.get("posts", {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        const data = response.data;
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort posts by date
        setPosts(data);
        setIsLoading(false); // Mark loading as complete
      } else {
        throw new Error(`Failed to fetch posts: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false); // Mark loading as complete even in case of an error
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("posts/create", {
        content,
        author: user._id,
      });
  
      if (response.data.success) {
        setContent("");
        fetchPosts();
      } else {
        console.error("Post creation failed.", response.data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Fetch posts on page load
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
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
              <PostCard key={post._id} post={post} />
            ))}
          </Container>
        )}
    </>
  );
};
