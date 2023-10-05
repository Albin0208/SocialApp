import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row, Card } from "react-bootstrap";
import { useAuth } from "../utils/AuthContext";
import { baseUrl } from "../shared";
import { FriendRequests } from "../components/FriendRequests";
import { SearchForm } from "../components/SearchForm";

export const Friends = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState("");

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}user/${user._id}`, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = response.data;
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseUrl}user/username/${content}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      setUsers(data);
    } catch (error) {
      console.error("Error searching for friends:", error);
    }
  };

  const handleRequest = async (e, requestId, accept = true) => {
    e.preventDefault();

    try {
      const updatedFriendRequests = currentUser.friendRequests.filter(
        user => user._id !== requestId
      );
      const updatedFriends = accept
        ? [...currentUser.friends.map(friend => friend._id), requestId]
        : [...currentUser.friends];

      const response = await axios.patch(
        `${baseUrl}user/${user._id}`,
        {
          friendRequests: updatedFriendRequests,
          friends: updatedFriends,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      fetchUser();
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const { friendRequests, friends } = currentUser || {
    friendRequests: [],
    friends: [],
  };

  return (
    <>
      <h1>Requests</h1>
      <FriendRequests
        friendsData={friendRequests}
        handleRequest={handleRequest}
      />
      <h1>Friends</h1>
      <Row>
        {friends.map(friend => (
          <Col md={4} key={friend._id}>
            <Card>
              <Link
                to={`/profile/${friend._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card.Body>
                  <Row>
                    <Col>
                      <Card.Title>{friend.username}</Card.Title>
                    </Col>
                  </Row>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      <SearchForm
        content={content}
        setContent={setContent}
        handleSubmit={handleSubmit}
      />

      <h1>Friends</h1>
      <p>Friends page</p>
      {users.map(user => (
        <Card>
          <Link
            to={`/profile/${user._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
            </Card.Body>
          </Link>
        </Card>
      ))}
    </>
  );
};
