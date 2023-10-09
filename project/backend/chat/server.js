import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
  },
});

export const startChat = (req, res) => {
  console.log(req.body);

  io.on("connection", socket => {
    console.log("New client connected");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  io.listen(4000);

  return res.status(200).json({ message: "Chat started" });
};
