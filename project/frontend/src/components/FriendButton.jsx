import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import {
  PersonCheckFill,
  PersonFillAdd,
  PersonXFill,
} from "react-bootstrap-icons"; // Import the third icon

export const FriendButton = ({ profileUser, currentUser, setIsFriend }) => {
  const [buttonText, setButtonText] = useState("Add Friend");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (profileUser?.friends.some(friend => friend._id === currentUser._id)) {
      setButtonText("Remove Friend");
    } else if (
      profileUser?.friendRequests.some(
        request => request._id === currentUser._id
      )
    ) {
      setButtonText("Request Sent");
    } else {
      setButtonText("Add Friend");
    }
  }, [profileUser, currentUser]);

  const handleFriendRequest = async () => {
    try {
      const response = await axiosPrivate.post(
        `user/${profileUser._id}/send-request`,
        {
          senderId: currentUser._id,
        }
      );

      if (response.status === 200) {
        const { message } = response.data;

        if (message === "Request accepted") {
          setButtonText("Remove Friend");
          setIsFriend(true);
        } else if (message === "Request sent") {
          setButtonText("Request Sent");
        } else if (message === "Request withdrawn" || message === "Friend removed") {
          setButtonText("Add Friend");
          setIsFriend(false);
        } else if (message === "Friend added") {
          setButtonText("Remove Friend");
          setIsFriend(true);
        }
        return true;
      }
    } catch (error) {
      console.log(error);
      console.error("Error sending friend request:", error.message);
    }
    return false;
  };

  let iconComponent;
  let buttonVariant;

  if (buttonText === "Add Friend") {
    iconComponent = <PersonFillAdd className="me-1 mb-1" />;
    buttonVariant = "primary";
  } else if (buttonText === "Request Sent") {
    iconComponent = <PersonCheckFill className="me-1 mb-1" />;
    buttonVariant = "secondary";
  } else if (buttonText === "Remove Friend") {
    iconComponent = <PersonXFill className="me-1 mb-1" />;
    buttonVariant = "danger";
  }

  return (
    <Button className="w-100" variant={buttonVariant} onClick={handleFriendRequest}>
      {iconComponent}
      {buttonText}
    </Button>
  );
};
