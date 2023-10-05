import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "../api/axios";

export const FriendButton = ({ profileUser, currentUser }) => {
  const [buttonText, setButtonText] = useState("Add Friend");

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
      const response = await axios.patch(`user/${profileUser._id}`, {
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
  
      const response = await axios.patch(`user/${profileUser._id}`, {
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
      const response = await axios.patch(`user/${profileUser._id}`, {
        friends: profileUser.friends.filter(
          friendId => friendId !== currentUser._id
        ),
      });
  
      if (response.status === 200) {
        return true;
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
  
  const updateCurrentUserSentRequests = async (action) => {
    try {
      const updatedSentRequests =
        action === "add"
          ? [...currentUser.sentRequests, profileUser._id]
          : currentUser.sentRequests.filter(
              request => request !== profileUser._id
            );
  
      const response = await axios.patch(`user/${currentUser._id}`, {
        sentRequests: updatedSentRequests,
      });
  
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Error updating current user's sent requests:", error.message);
    }
    return false;
  };
  

  return (
    <Button className="w-100" variant="primary" onClick={handleFriendRequest}>
      {buttonText}
    </Button>
  );
};
