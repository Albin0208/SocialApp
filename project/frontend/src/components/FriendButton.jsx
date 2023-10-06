import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { PersonCheckFill, PersonFillAdd, PersonXFill } from "react-bootstrap-icons"; // Import the third icon

export const FriendButton = ({ profileUser, currentUser }) => {
  const [buttonText, setButtonText] = useState("Add Friend");
  const axiosPrivate = useAxiosPrivate();

  // TODO - Allow the user to accept or decline friend requests when they are on the users profile page if that user has sent them a friend request

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

  const sendFriendRequest = async () => {
    try {
      const response = await axiosPrivate.patch(`user/${profileUser._id}`, {
        friendRequests: [...profileUser.friendRequests, currentUser._id],
      });

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Error sending friend request:", error.message);
    }
    return false;
  };

  const withdrawFriendRequest = async () => {
    try {
      const updatedFriendRequests = profileUser.friendRequests.filter(
        request => request._id !== currentUser._id
      );

      const response = await axiosPrivate.patch(`user/${profileUser._id}`, {
        friendRequests: updatedFriendRequests,
      });

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Error withdrawing friend request:", error.message);
    }
    return false;
  };

  const removeFriend = async () => {
    try {
      const response = await axiosPrivate.patch(`user/${profileUser._id}`, {
        friends: profileUser.friends.filter(
          friend => friend._id !== currentUser._id
        ),
      });

      if (response.status === 200) {
        // Remove the profile user from the current user's friends
        const response = await axiosPrivate.patch(`user/${currentUser._id}`, {
          friends: currentUser.friends.filter(
            friend => friend._id !== profileUser._id
          ),
        });
        if (response.status === 200) return true;
      }
    } catch (error) {
      console.error("Error removing friend:", error.message);
    }
    return false;
  };

  const handleFriendRequest = async () => {
    try {
      if (buttonText === "Add Friend") {
        if (await sendFriendRequest()) {
          // Update the current user's sent requests
          if (await updateCurrentUserSentRequests("add")) {
            setButtonText("Request Sent");
            console.log("Friend request sent");
          }
        }
      } else if (buttonText === "Request Sent") {
        if (await withdrawFriendRequest()) {
          // Update the current user's sent requests
          if (await updateCurrentUserSentRequests("withdraw")) {
            setButtonText("Add Friend");
            console.log("Friend request withdrawn");
          }
        }
      } else if (buttonText === "Remove Friend") {
        if (await removeFriend()) {
          setButtonText("Add Friend");
          console.log("Friend removed");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  const updateCurrentUserSentRequests = async action => {
    try {
      const updatedSentRequests =
        action === "add"
          ? [...currentUser.sentRequests, profileUser._id]
          : currentUser.sentRequests.filter(
              request => request !== profileUser._id
            );

      const response = await axiosPrivate.patch(`user/${currentUser._id}`, {
        sentRequests: updatedSentRequests,
      });

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(
        "Error updating current user's sent requests:",
        error.message
      );
    }
    return false;
  };

  let iconComponent;

  if (buttonText === "Add Friend") {
    iconComponent = <PersonFillAdd className="me-1 mb-1" />;
  } else if (buttonText === "Request Sent") {
    iconComponent = <PersonCheckFill className="me-1 mb-1" />;
  } else if (buttonText === "Remove Friend") {
    iconComponent = <PersonXFill className="me-1 mb-1" />;
  }

  return (
    <Button className="w-100" variant="primary" onClick={handleFriendRequest}>
      {iconComponent}
      {buttonText}
    </Button>
  );
};
