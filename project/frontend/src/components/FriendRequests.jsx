import { Button, Col, Row, Card, Badge } from "react-bootstrap";

export const FriendRequests = ({ friendsData, handleRequest }) => {
  return (
    <Row>
      {friendsData.map(friend => (
        <Col md={4} key={friend._id}>
          <Card>
            <Card.Body>
              {/* <Row> */}
              <Row>
                <Card.Text className="text-center">
                    <span className="fw-bold text-capitalize">
                      {friend.username}
                    </span>{" "}
                    has sent you a friend request
                </Card.Text>
              </Row>
              <Row className="mt-2">
                <Col className="text-center">
                  <Button
                    className="w-75"
                    variant="success"
                    onClick={e => handleRequest(e, friend._id, true)}
                  >
                    Accept
                  </Button>
                </Col>
                <Col className="text-center">
                  <Button
                    className="w-75"
                    variant="danger"
                    onClick={e => handleRequest(e, friend._id, false)}
                  >
                    Decline
                  </Button>
                </Col>
              </Row>
              {/* </Row> */}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
