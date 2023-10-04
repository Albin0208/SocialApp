import { Link } from "react-router-dom";
import { baseUrl } from "../shared";
import { Button, Col, Row, Form, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";

export const Friends = () => {
  const [users, setUsers] = useState([]); // Array of users to display on the page
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState([]); // Array of users to display on the page
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await fetch(baseUrl + "user/" + user._id, {
        method: "GET",
        credentials: "include", // Send cookies along with the request
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentUser(data);
      // console.log(data);

      // Fetch all posts from the user's posts array
      // const friendPromises = data.friendRequests.map(async id => {
      //   const postResponse = await fetch(baseUrl + "user/" + id, {
      //     method: "GET",
      //     credentials: "include", // Send cookies along with the request
      //   });

      //   if (!postResponse.ok) {
      //     throw new Error(`HTTP Error! Status: ${postResponse.status}`);
      //   }

      //   return postResponse.json();
      // });

      // const friendsRequests = await Promise.all(friendPromises);
      // setFriendRequests(friendsRequests);

      // console.log(friendsRequests);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch(baseUrl + "user/username/" + content, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies along with the request
      });

      const data = await response.json();
      console.log(data);
      setUsers(data);
    } catch (error) {}
  };

  const handleRequest = async (e, requestId) => {
    e.preventDefault();

    try {
      if (e.target.innerHTML === "Accept") {
        await fetch(baseUrl + "user/" + user._id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send cookies along with the request
          body: JSON.stringify({
            friendRequests: currentUser.friendRequests.filter(
              user => user._id !== requestId
            ),
            friends: [
              ...currentUser.friends.map(friend => friend._id),
              requestId,
            ],
          }),
        });

        fetchUser();
      } else if (e.target.innerHTML === "Decline") {
        await fetch(baseUrl + "user/" + user._id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send cookies along with the request
          body: JSON.stringify({
            friendRequests: currentUser.friendRequests.filter(
              user => user._id !== requestId
            ),
          }),
        });

        fetchUser();
      }
    } catch (error) {}
  };

  return (
    <>
      <h1>Requests</h1>
      <Row>
        {currentUser?.friendRequests.map(request => (
          <Col md={4} key={request._id}>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>{request.username}</Card.Title>
                  </Col>
                  <Col>
                    <Button
                      className="me-1"
                      variant="success"
                      onClick={e => handleRequest(e, request._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={e => handleRequest(e, request._id)}
                    >
                      Decline
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h1>Friends</h1>
      <Row>
        {currentUser?.friends.map(friend => (
          <Col md={4} key={friend._id}>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>{friend.username}</Card.Title>
                  </Col>
                  <Col>
                    <Button
                      className="me-1"
                      variant="success"
                      onClick={e => handleRequest(e, friend._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={e => handleRequest(e, friend._id)}
                    >
                      Decline
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Form id="tweet_form" onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                id="tweet"
                style={{ resize: "none" }}
                placeholder="Find Friends..."
                aria-label="With textarea"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={1} className="ps-md-0 mt-2 mt-md-0">
            <Button className="h-100 w-100" type="submit" variant="primary">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      <h1>Friends</h1>
      <p>Friends page</p>
      {users?.map(user => (
        <Card as={Link} to={"/profile/" + user._id} key={user._id}>
          <Card.Body>
            <Card.Title>{user.username}</Card.Title>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};
