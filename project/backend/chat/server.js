import { Server } from "socket.io";

export const setupSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", socket => {
    socket.on("join", room => {
      console.log(`Joining room ${room}`);
      socket.join(room);

      // Check if there are other clients in the room
      const clientsInRoom = io.sockets.adapter.rooms.get(room);
      const isOtherUserConnected = clientsInRoom && clientsInRoom.size > 1;

      // Emit the "userConnected" event to the room
      io.to(room).emit("userConnected", { connected: isOtherUserConnected });
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
        console.log(`Leaving room ${room}`);
        io.to(room).emit("userConnected", { connected: false });
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}
