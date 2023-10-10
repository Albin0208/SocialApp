import { Server } from "socket.io";

export const setupSocketServer = httpServer => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", socket => {
    socket.on("join", (room, username) => {
      socket.join(room);
      socket.username = username;

      // Check if there are other clients in the room
      const clientsInRoom = io.sockets.adapter.rooms.get(room);
      const isOtherUserConnected = clientsInRoom && clientsInRoom.size > 1;
      // Get the username of the other user
      const otherUser = [...clientsInRoom].find(
        socketId => socketId !== socket.id
      );

      // Get the socket instance for the other user
      const otherUserSocket = io.sockets.sockets.get(otherUser);

      socket.to(room).emit("userConnected", { connected: true, username });
      // Emit the "userConnected" event to the room
      io.to(room).emit("userConnected", {
        connected: isOtherUserConnected,
        username: otherUserSocket?.username,
      });
    });

    socket.on("message", payload => {
      io.to(payload.room).emit("messageResponse", {
        message: payload.message,
        username: payload.username,
        sender: payload.sender,
      });
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach(room => {
        io.to(room).emit("userConnected", { connected: false });
      });
    });
  });
};
