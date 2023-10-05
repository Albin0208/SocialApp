import { useAuth } from "../utils/AuthContext";
import { baseUrl } from "../shared";
import { useEffect, useState } from "react";
import { PostCard } from "../components/PostCard";
import { CreatePost } from "../components/CreatePost";
import { Alert, Button, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

export const Profile = ({ userId }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friendButton, setFriendButton] = useState("Add Friend");
  const [profileUser, setProfileUser] = useState(null);

  const { id } = useParams();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(baseUrl + "user/" + (id ? id : user._id), {
        method: "GET",
        credentials: "include", // Send cookies along with the request
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProfileUser(data);
      console.log(data);

      data.friendRequests.forEach(request => {
        if (request === user._id) {
          setFriendButton("Request Sent");
        }
      });

      data.friends.forEach(friend => {
        if (friend === user._id) {
          setFriendButton("Remove Friend");
        }
      });

      const postIds = data.posts;

      // Fetch all posts from the user's posts array
      const postPromises = postIds.map(async postId => {
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

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimeout(() => {}, 5000);
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
        await fetch(baseUrl + "user/" + profileUser._id, {
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

  const handleFriendRequest = async () => {
    try {
      const response = await fetch(baseUrl + "user/" + profileUser._id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies along with the request
        body: JSON.stringify({
          friendRequests: [...profileUser.friendRequests, user._id],
        }),
      });

      console.log(response);

      if (response.ok) {
        setFriendButton("Request Sent");
        console.log("Friend request sent");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h1>{profileUser?.username}</h1>
          <h2>Posts</h2>
        </Col>
        {id !== user._id && (
          <Col md={2}>
            <Button
              className="w-100"
              variant="primary"
              onClick={handleFriendRequest}
            >
              {friendButton}
              {/* Add Friend */}
              {/* Request Sent */}
              {/* Remove Friend */}
            </Button>
          </Col>
        )}
      </Row>
      <hr />
      <CreatePost
        handleSubmit={handleSubmit}
        content={content}
        setContent={setContent}
      />
      {isLoading && <p>Loading...</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
};
