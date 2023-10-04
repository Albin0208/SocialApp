import { useAuth } from "../utils/AuthContext";
import { baseUrl} from "../shared";
import { useEffect, useState } from "react";
import { PostCard } from "../components/PostCard";
import { CreatePost } from "../components/CreatePost";
import { Alert } from "react-bootstrap";

export const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(baseUrl + "user/" + user._id, {
        method: "GET",
        credentials: "include", // Send cookies along with the request
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      const postIds = data.posts;

      // Fetch all posts from the user's posts array
      const postPromises = postIds.map(async (postId) => {
        const postResponse = await fetch(baseUrl + "posts/" + postId, {
          method: "GET",
          credentials: "include", // Send cookies along with the request
        });

        if (!postResponse.ok) {
          throw new Error(`HTTP Error! Status: ${postResponse.status}`);
        }

        return postResponse.json();
      });

      // Resolve all the promises to get an array of posts
      const userPosts = await Promise.all(postPromises);

      // Sort posts by creation date (assuming posts have a 'createdAt' field)
      userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Store the fetched and sorted posts in a state variable
      setPosts(userPosts);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      
    }
    , 5000);
    try {
      const response = await fetch(baseUrl + "posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies along with the request
        body: JSON.stringify({
          content,
          author: user._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent("");
        // Update the state with the new post
        setPosts([data, ...posts]);
        await fetch(baseUrl + "user/" + user._id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send cookies along with the request
          body: JSON.stringify({
            posts: [...posts, data._id],
          }),
        });
      } else {
        console.error("Post creation failed.", data);
        setError("Post creation failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>{user.username}</h1>
      <h2>Posts</h2>
      <hr />
      <CreatePost
        handleSubmit={handleSubmit}
        content={content}
        setContent={setContent}
      />
      {isLoading && <p>Loading...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
};
