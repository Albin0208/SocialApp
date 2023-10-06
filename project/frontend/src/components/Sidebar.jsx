import React from "react";
import { ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <ListGroup variant="flush">
      <ListGroup.Item className="bg-light-custom" action as={NavLink} to={"/friends"} end>
        Friends
      </ListGroup.Item>
      <ListGroup.Item className="bg-light-custom" action as={NavLink} to={"/friends/requests"}>
        Friend Requests
      </ListGroup.Item>
      <ListGroup.Item className="bg-light-custom" action as={NavLink} to={"/friends/search"}>
        Find Friends
      </ListGroup.Item>
    </ListGroup>
  );
}

export default Sidebar;
