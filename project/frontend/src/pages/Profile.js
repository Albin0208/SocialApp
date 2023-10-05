import axios from "axios";
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
      const response = await axios.get(baseUrl + "user/" + (id ? id : user._id), {
        withCredentials: true, // Send cookies along with the request
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      const data = response.data;
      setProfileUser(data);
      console.log(data);
  
      data.friendRequests.forEach((request) => {
        if (request === user._id) {
          setFriendButton("Request Sent");
        }
      });
  
      data.friends.forEach((friend) => {
        if (friend === user._id) {
          setFriendButton("Remove Friend");
        }
      });
  
      const postIds = data.posts;
  
      // Fetch all posts from the user's posts array
      const postPromises = postIds.map(async (postId) => {
        const postResponse = await axios.get(baseUrl + "posts/" + postId, {
          withCredentials: true, // Send cookies along with the request
        });
  
        if (postResponse.status !== 200) {
          throw new Error(`HTTP Error! Status: ${postResponse.status}`);
        }
  
        return postResponse.data;
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
    try {
      const response = await axios.post(baseUrl + "posts/create", {
        content,
        author: user._id,
      }, {
        withCredentials: true, // Send cookies along with the request
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
  
      const data = response.data;
  
      if (response.status === 201) {
        setContent("");
        // Update the state with the new post
        setPosts([data, ...posts]);
        await axios.patch(baseUrl + "user/" + profileUser._id, {
          posts: [...posts, data._id],
        }, {
          withCredentials: true, // Send cookies along with the request
          headers: {
            "Content-Type": "application/json",
          },
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
      const response = await axios.patch(baseUrl + "user/" + profileUser._id, {
        friendRequests: [...profileUser.friendRequests, user._id],
      }, {
        withCredentials: true, // Send cookies along with the request
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log(response);
  
      if (response.status === 200) {
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
