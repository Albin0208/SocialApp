import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Row, Col } from "react-bootstrap";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { FriendButton } from "../components/FriendButton";
import { useAuth } from "../utils/AuthContext";
import { PostCard } from "../components/PostCard";
import { CreatePost } from "../components/CreatePost";

export const Profile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileUser, setProfileUser] = useState(null);

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
    try {
      const response = await axiosPrivate.post("posts/create", {
        content,
        author: user._id,
      });

      if (response.status === 201) {
        setContent("");
        // Update the state with the new post
        setPosts([response.data, ...posts]);
        await axiosPrivate.patch(`user/${profileUser._id}`, {
          posts: [...posts, response.data._id],
        });
      } else {
        console.error("Post creation failed.");
        setError("Post creation failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h1>{profileUser?.username}</h1>
          <h2>Posts</h2>
        </Col>
        {id && (
          <Col md={2}>
            <FriendButton profileUser={profileUser} currentUser={user} />
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
