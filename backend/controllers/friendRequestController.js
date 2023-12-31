import User from "../models/userModel.js";

/**
 * Sends a friend request from the sender to the receiver.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with a message or error.
 * @throws {Object} Error if user not found or missing parameters.
 */
export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { senderId, state } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    if (senderId == receiverId) {
      return res.status(400).json({ error: "Cannot send request to self" });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check the state of the request
    switch (state) {
      case "send":
        // Check if the other user has already sent a request if so we accept
        if (receiver.sentRequests.includes(senderId)) {
          // Accept the request
          sender.friends.push(receiverId);
          receiver.friends.push(senderId);
          // Remove the request from both users
          sender.friendRequests = sender.friendRequests.filter(
            id => id != receiverId
          );
          receiver.sentRequests = receiver.sentRequests.filter(
            id => id != senderId
          );

          await Promise.all([sender.save(), receiver.save()]);

          return res.status(200).json({ message: "Request accepted" });
        }

        // Add the request to both users
        sender.sentRequests.push(receiverId);
        receiver.friendRequests.push(senderId);

        await Promise.all([sender.save(), receiver.save()]);
        return res.status(200).json({ message: "Request sent" });
      case "withdraw":
        // Withdraw the request
        sender.sentRequests = sender.sentRequests.filter(
          id => id != receiverId
        );
        receiver.friendRequests = receiver.friendRequests.filter(
          id => id != senderId
        );

        await Promise.all([sender.save(), receiver.save()]);

        return res.status(200).json({ message: "Request withdrawn" });
      case "remove":
        sender.friends = sender.friends.filter(id => id != receiverId);
        receiver.friends = receiver.friends.filter(id => id != senderId);

        await Promise.all([sender.save(), receiver.save()]);

        return res.status(200).json({ message: "Friend removed" });
      default:
        // If we get here the state is invalid
        return res.status(400).json({ error: "Invalid state" });
    }
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: error.message });
  }
};

/**
 * Accepts a friend request between two users.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.senderId - The ID of the user who sent the friend request.
 * @param {string} req.body.receiverId - The ID of the user who received the friend request.
 * @returns {Object} The response object with a message or error.
 */
export const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.params;
    const { receiverId } = req.body;

    if (!senderId || !receiverId)
      return res.status(400).json({ error: "Missing parameters" });

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver)
      return res.status(404).json({ error: "User not found" });

    // Check if the sender actually sent a request and
    // Check if the receiver actually received a request
    if (
      !sender.sentRequests.includes(receiverId) ||
      !receiver.friendRequests.includes(senderId)
    )
      return res.status(400).json({ error: "No request found" });

    sender.friends.push(receiverId);
    receiver.friends.push(senderId);

    sender.sentRequests = sender.sentRequests.filter(id => id != receiverId);
    receiver.friendRequests = receiver.friendRequests.filter(
      id => id != senderId
    );

    await Promise.all([sender.save(), receiver.save()]);

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: error.message });
  }
};

/**
 * Declines a friend request from a user.
 *
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.senderId - The ID of the user who sent the friend request.
 * @param {string} req.body.receiverId - The ID of the user who received the friend request.
 * @returns {Object} The response object with a message or error.
 * @throws {Object} The error object if an error occurs.
 */
export const declineFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.params;
    const { receiverId } = req.body;

    if (!senderId || !receiverId)
      return res.status(400).json({ error: "Missing parameters" });

    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver)
      return res.status(404).json({ error: "User not found" });

    // Check if the sender actually sent a request and
    // Check if the receiver actually received a request
    if (
      !sender.sentRequests.includes(receiverId) ||
      !receiver.friendRequests.includes(senderId)
    )
      return res.status(400).json({ error: "No request found" });

    sender.sentRequests = sender.sentRequests.filter(id => id != receiverId);
    receiver.friendRequests = receiver.friendRequests.filter(
      id => id != senderId
    );

    await Promise.all([sender.save(), receiver.save()]);

    res.status(200).json({ message: "Request declined" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: error.message });
  }
};
