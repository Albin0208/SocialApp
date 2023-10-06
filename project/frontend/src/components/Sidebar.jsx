import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Sidebar = ({requests}) => {
  return (
    <ListGroup variant="flush">
      <ListGroup.Item
        className="bg-light-custom"
        action
        as={NavLink}
        to={"/friends"}
        end
      >
        Friends
      </ListGroup.Item>
      <ListGroup.Item
        className="bg-light-custom"
        action
        as={NavLink}
        to={"/friends/requests"}
      >
        Friend Requests
        {requests.length > 0 && (
          <Badge className="ms-2" pill variant="primary" rounded>
            {requests.length}
          </Badge>
        )}
      </ListGroup.Item>
      <ListGroup.Item
        className="bg-light-custom"
        action
        as={NavLink}
        to={"/friends/search"}
      >
        Find Friends
      </ListGroup.Item>
    </ListGroup>
  );
};

export default Sidebar;
