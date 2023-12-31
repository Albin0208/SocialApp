import useAxiosPrivate from "../utils/useAxiosPrivate";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Row, Card } from "react-bootstrap";
import { useAuth } from "../utils/AuthContext";
import { FriendRequests } from "../components/FriendRequests";
import { SearchForm } from "../components/SearchForm";
import Sidebar from "../components/Sidebar";

export const Friends = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState("");
  const { tab } = useParams();

  useEffect(() => {
    fetchUser();
  }, [tab]);

  const fetchUser = async () => {
    try {
      const response = await axiosPrivate.get(`user/${user._id}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setCurrentUser(response.data);
      } else {
        throw new Error(`Failed to fetch user data: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.get(`user/username/${content}`);
      const result = response.data.filter(user => user._id !== currentUser._id);
      setUsers(result);
    } catch (error) {
      console.error("Error searching for friends:", error);
    }
  };

  const handleRequest = async (e, requestId, accept = true) => {
    e.preventDefault();

    try {
      let response;
      if (accept) {
        response = await axiosPrivate.post(
          `user/${requestId}/accept-friend-request`,
          {
            receiverId: currentUser._id,
          }
        );
      } else {
        response = await axiosPrivate.post(
          `user/${requestId}/decline-friend-request`,
          {
            receiverId: currentUser._id,
          }
        );
      }

      if (response.status === 200) {
        // Remove the friend request from the current user's friend requests
        const newRequests = currentUser.friendRequests.filter(
          request => request._id !== requestId
        );
        setCurrentUser({ ...currentUser, friendRequests: newRequests });
      }
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  const { friendRequests, friends } = currentUser || {
    friendRequests: [],
    friends: [],
  };

  return (
    <Row>
      <Col md={2} className="border-end">
        <Sidebar requests={friendRequests} />
      </Col>
      <Col md={10}>
        {tab === "requests" && (
          <>
            <h1>Requests</h1>
            {friendRequests.length === 0 && <p>You have no friend requests.</p>}
            <FriendRequests
              friendsData={friendRequests}
              handleRequest={handleRequest}
            />
          </>
        )}
        {tab === undefined && (
          <>
            <h1>Friends</h1>
            <Row>
              {friends.length === 0 && (
                <p>You have no friends. Search for friends to add!</p>
              )}
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
                            <Card.Title className="text-capitalize">{friend.username}</Card.Title>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
        {tab === "search" && (
          <>
            <h1>Find Friends</h1>
            <SearchForm
              content={content}
              setContent={setContent}
              handleSubmit={handleSubmit}
            />
            {users.length === 0 && <p>No users found.</p>}
            {users.map(user => (
              <Card className="mb-2" key={user._id}>
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
        )}
      </Col>
    </Row>
  );
};
