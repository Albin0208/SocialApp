import socketIO from "socket.io-client";
import { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../utils/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const socket = socketIO("http://localhost:5000");

export const Chat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const connectToChat = async () => {
    socket.connect();
    let r;
    if (user._id > id) {
      r = user._id + id;
    } else {
      r = id + user._id;
    }

    setRoom(r);
    console.log(room);
    socket.emit("join", r);
  };

  useEffect(() => {
    connectToChat();
  }, []);

  useEffect(() => {
    socket.on("messageResponse", msg => {
      setMessages([...messages, msg]);
    });

    return () => {
      socket.off("messageResponse");
    };
  }, [messages]);

  const handleSubmit = e => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("message", message, room);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <Button variant="danger" onClick={() => {
        socket.disconnect()
        navigate("/profile")
        }}>Disconnect</Button>

      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                id="message"
                style={{ resize: "none" }}
                placeholder="What's happening?"
                aria-label="With textarea"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={1} className="ps-md-0 mt-2 mt-md-0">
            <Button className="h-100 w-100" type="submit" variant="primary">
              Post
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
