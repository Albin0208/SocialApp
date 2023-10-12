import { Server } from "socket.io";
import { setupSocketServer } from "../chat/server.js";
import http from "http";
import { io as ioc } from "socket.io-client";
import assert from "assert";

describe("Socket Server", () => {
  let httpServer;
  let io;
  let client;

  before(done => {
    httpServer = http.createServer();
    io = setupSocketServer(httpServer);
    httpServer.listen(5000);

    // Setup the client inside the 'before' block
    client = ioc("http://localhost:5000");
    done();
  });

  after(done => {
    // Disconnect the client in the 'after' block
    if (client.connected) {
      client.disconnect();
    }
    io.close();
    httpServer.close();
    done();
  });

  it("should connect to the server", done => {
    // Join the client to room test
    client.on("connect", () => {
      client.emit("join", "test", "testuser");
      const clientsInRoom = io.sockets.adapter.rooms;
      assert(clientsInRoom.has(client.id));
      done();
    });
  });

  it("should send and receive messages", done => {
    const message = "Hello, world!";
    client.on("messageResponse", payload => {
      assert.equal(payload.message, message);
      done();
    });
    client.emit("message", { message, room: "test", username: "testuser" });
  });
  
  it("should send and receive userConnected event, no other user is connected connected is false", done => {
    client.on("userConnected", payload => {
      // console.log(payload);
      assert.equal(payload.connected, false);
      done();
    });

    client.emit("join", "test", "testuser");
  })

  it("should send and receive userConnected event, other user is connected connected is true", done => {
    // Create a new client (client3)
    const client3 = ioc("http://localhost:5000");
  
    // Connect client3 and join the room
    client3.on("connect", () => {
      client3.emit("join", "testa", "testuser3");
  
      // Create client2 and join the same room
      const client2 = ioc("http://localhost:5000");
      client2.on("connect", () => {
        client2.emit("join", "testa", "testuser2");
  
        // Listen for userConnected event on client3
        client3.on("userConnected", payload => {
          console.log(payload);
          assert.equal(payload.connected, true);
          assert.equal(payload.username, "testuser2");
          
          // Disconnect both clients
          client2.disconnect();
          client3.disconnect();
          done();
        });
      });
    });
  });
  
  
});
