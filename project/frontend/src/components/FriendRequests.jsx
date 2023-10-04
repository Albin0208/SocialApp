import { Button, Col, Row, Card } from "react-bootstrap";

export const FriendRequests = ({ friendsData, handleRequest }) => {
  return (
    <Row>
      {friendsData.map((friend) => (
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
                    onClick={(e) => handleRequest(e, friend._id, true)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(e) => handleRequest(e, friend._id, false)}
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
  );
}