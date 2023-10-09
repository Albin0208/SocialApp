import socketIO from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
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
  const messagesRef = useRef();

  const connectToChat = async () => {
    socket.connect();
    const chatRoom = `${user._id > id ? user._id : id}${
      user._id > id ? id : user._id
    }`;
    setRoom(chatRoom);
    socket.emit("join", chatRoom);
  };

  useEffect(() => {
    connectToChat();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("messageResponse", msg => {
      setMessages([...messages, msg]);
      // Scroll to the bottom of the messages container
      setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 0);
    });
    return () => {
      socket.off("messageResponse");
    };
  }, [messages]);

  const handleSubmit = e => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("message", {
        message,
        room,
        username: user.username,
        sender: user._id,
      });
      setMessage("");
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h3>Connected to chat</h3>
        </Col>
        <Col className="text-end">
          <Button
            variant="danger"
            onClick={() => {
              socket.disconnect();
              navigate("/profile/" + id);
            }}
          >
            Disconnect
          </Button>
        </Col>
      </Row>
      <hr className="mb-0" />
      
      <div className="message-container p-3 pb-0" ref={messagesRef}>
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`message mt-2 ${msg.sender === user._id ? 'message-sender' : 'message-receiver'}`}
    >
      <p className="m-0">{msg.message}</p>
    </div>
  ))}
</div>


      <Form onSubmit={handleSubmit} className="mt-2">
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                id="message"
                style={{ resize: "none" }}
                placeholder={"Say something..."}
                aria-label="With textarea"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={1} className="ps-md-0 mt-2 mt-md-0">
            <Button className="h-100 w-100" type="submit" variant="primary">
              Send
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
