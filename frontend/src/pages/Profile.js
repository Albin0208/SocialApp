import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Row, Col, Button } from "react-bootstrap";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { FriendButton } from "../components/FriendButton";
import { useAuth } from "../utils/AuthContext";
import { PostCard } from "../components/PostCard";
import { CreatePost } from "../components/CreatePost";
import { ChatFill } from "react-bootstrap-icons";

export const Profile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const navigate = useNavigate();

  if (id && id === user._id) {
    navigate("/profile");
  }

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get(`user/${id || user._id}`, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error("User not found");
      }

      const data = response.data;
      setProfileUser(data);
      setIsFriend(data.friends.some(friend => friend._id === user._id));

      const postIds = data.posts;

      // Fetch all posts from the user's posts array
      const postPromises = postIds.map(async postId => {
        const postResponse = await axiosPrivate.get(`posts/${postId}`, {
          withCredentials: true,
        });

        if (postResponse.status !== 200) {
          throw new Error("Failed to fetch posts");
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
      console.error("Error:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    // Validate post content
    if (content.trim().length < 1) {
      setError("Post content is required.");
      setIsLoading(false);
      return;
    }

    if (content.trim().length > 140) {
      setError("Post content can't be longer than 140 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosPrivate.post("posts/create", {
        content: content.trim(),
        author: user._id,
        receiver: profileUser._id,
      });

      if (response.status === 201) {
        setContent("");
        // Update the state with the new post
        setPosts([response.data, ...posts]);
        await axiosPrivate.patch(`user/${profileUser._id}`, {
          posts: [...posts, response.data._id],
        });
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.response.data.message.split("content: ")[1]);
    } finally {
      setIsLoading(false);
    }
  };

  const toChat = () => {
    navigate(`/chat/${profileUser._id}`, {
      state: { username: profileUser.username },
    });
  }
  
  return (
    <>
      <Row>
        <Col>
          <h1 className="text-capitalize">{profileUser?.username}</h1>
        </Col>
        {id && (
          <Col sm={5} md={6} lg={4} className="ps-0">
            <Row>
              <Col className="pe-0">
                <Button
                  className="w-100"
                  onClick={toChat}
                >
                  <ChatFill className="me-1 mb-1" />
                  Chat
                </Button>
              </Col>
              <Col md={7} className="mt-2 mt-md-0">
                <FriendButton
                  profileUser={profileUser}
                  currentUser={user}
                  setIsFriend={setIsFriend}
                />
              </Col>
            </Row>
          </Col>
        )}
      </Row>
      <hr />

      {(isFriend || profileUser?._id === user._id) && (
        <>
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
      )}
    </>
  );
};
