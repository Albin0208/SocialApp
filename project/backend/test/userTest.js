import superagent from "superagent";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "dotenv/config";
import assert from "assert";
import { closeDb, setDb, purgeDatabase } from "../database.js";
import { startServer } from "../server.js";

let server; // Define the 'server' variable in the outer scope

const API_URL = "http://localhost:5000";

const generateAccessToken = username => {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = username => {
  return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

describe("User routes", () => {
  before(async () => {
    setDb("testdb"); // Set the database to test mode
    server = await startServer(); // Start the Express server and assign it to 'server'
    await purgeDatabase(); // Purge the database
  });

  after(async () => {
    await purgeDatabase(); // Purge the database
    closeDb(); // Close the database connection
    await server.close(); // Close the Express server using the 'server' variable
  });

  describe("/User/register", () => {
    it("/User/register should return 400 if username is missing", done => {
      superagent
        .post(API_URL + "/user/register")
        .send({ password: "testpassword" })
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });

    it("/User/register should return 400 if password is missing", done => {
      superagent
        .post(API_URL + "/user/register")
        .send({ username: "testuser" })
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });

    it("/User/register should return 201 and the user object", done => {
      superagent
        .post(API_URL + "/user/register")
        .send({ username: "testuser", password: "testpassword" })
        .end((err, res) => {
          // assert.equal(res.status, 201);
          const data = res.body;
          assert.equal(data.username, "testuser");

          done();
        });
    });

    it("/User/register should return 409 if username is already taken", done => {
      superagent
        .post(API_URL + "/user/register")
        .send({ username: "testuser", password: "testpassword" })
        .end((err, res) => {
          assert.equal(res.status, 409);
          done();
        });
    });
  });

  describe("/User/login", () => {
    it("/User/login should return 200 and the user object", done => {
      superagent
        .post(API_URL + "/user/login")
        .send({ username: "testuser", password: "testpassword" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          const data = res.body;
          assert.equal(data.user.username, "testuser");
          assert.equal(data.accessToken.length > 0, true);
          done();
        });
    });

    it("/User/login should return 401 when invalid credentials are provided", done => {
      superagent
        .post(API_URL + "/user/login")
        .send({ username: "testuser", password: "wrongpassword" })
        .end((err, res) => {
          assert.equal(res.status, 401);
          done();
        });
    });

    it("/User/login should return 404 when the user does not exist", done => {
      superagent
        .post(API_URL + "/user/login")
        .send({ username: "nonexistinguser", password: "testpassword" })
        .end((err, res) => {
          assert.equal(res.status, 404);
          done();
        });
    });
  });

  describe("/User", () => {
    it("/User should return 200 and the user object", done => {
      // Insert a new user into the database
      superagent
        .post(API_URL + "/user/register")
        .send({ username: "testuser2", password: "testpassword" })
        .end((err, res) => {
          assert.equal(res.status, 201);

          const accessToken = generateAccessToken("testuser2");

          superagent
            .get(API_URL + "/user/" + res.body._id)
            .set("authorization", "Bearer " + accessToken)
            .end((err, res) => {
              assert.equal(res.status, 200);
              const data = res.body;
              assert.equal(data.username, "testuser2");
              done();
            });
        });
    });

    describe("/User/:id", () => {
      it("/User/:id should return 404 when invalid id is provided", done => {
        superagent
          .get(API_URL + "/user/123")
          .set("authorization", "Bearer " + generateAccessToken("testuser2"))
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });

      it("/User/:id should return 404 when the user does not exist", done => {
        const accessToken = generateAccessToken("testuser2");

        superagent
          .get(API_URL + "/user/" + new mongoose.Types.ObjectId())
          .set("authorization", "Bearer " + accessToken)
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });

      it("/User/:id should return 200 and the user object", done => {
        // Insert a new user into the database
        superagent
          .post(API_URL + "/user/register")
          .send({ username: "testuser3", password: "testpassword" })
          .end((err, res) => {
            assert.equal(res.status, 201);

            const accessToken = generateAccessToken("testuser3");

            superagent
              .get(API_URL + "/user/" + res.body._id)
              .set("authorization", "Bearer " + accessToken)
              .end((err, res) => {
                assert.equal(res.status, 200);
                const data = res.body;
                assert.equal(data.username, "testuser3");
                done();
              });
          });
      });
    });

    describe("/User/username/:username", () => {
      it("/User/username/:username should return 200 and an array of user objects", done => {
        superagent
          .get(API_URL + "/user/username/testuser2")
          .set("authorization", "Bearer " + generateAccessToken("testuser2"))
          .end((err, res) => {
            assert.equal(res.status, 200);
            const data = res.body;
            assert.equal(data.length, 1);
            assert.equal(data[0].username, "testuser2");
            done();
          });
      });

      it("/User/username/:username with partial username should return 200 and an array of all matching users", done => {
        superagent
          .get(API_URL + "/user/username/test")
          .set("authorization", "Bearer " + generateAccessToken("test"))
          .end((err, res) => {
            assert.equal(res.status, 200);
            const data = res.body;
            assert.equal(data.length, 3);
            done();
          });
      });
    });

    describe("/User update", () => {
      let user1Id, user2Id;

      it("/User update should return 200 when the users sentRequests are updated", done => {
        superagent
          .post(API_URL + "/user/register")
          .send({ username: "testuser4", password: "testpassword" })
          .end((err, res) => {
            assert.equal(res.status, 201);
            user1Id = res.body._id;

            superagent
              .post(API_URL + "/user/register")
              .send({ username: "testuser5", password: "testpassword" })
              .end((err, res) => {
                assert.equal(res.status, 201);
                user2Id = res.body._id;
                const accessToken = generateAccessToken("testuser4");

                superagent
                  .patch(API_URL + "/user/" + user1Id)
                  .set("authorization", "Bearer " + accessToken)
                  .send({ sentRequests: [user2Id] })
                  .end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                  });
              });
          });
      });

      it("/User update should return 200 when the users friendRequests are updated", done => {
        const accessToken = generateAccessToken("testuser4");
        superagent
          .patch(API_URL + "/user/" + user1Id)
          .set("authorization", "Bearer " + accessToken)
          .send({ friendRequests: [user2Id] })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });
  });

  describe("Refresh token route", () => {
    it("should return 200 and a new access token", done => {
      const refreshToken = jwt.sign(
        { username: "testuser" },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      superagent
        .get(API_URL + "/user/refresh")
        .set("Cookie", "refreshToken=" + refreshToken + "; HttpOnly; Path=/;")
        .end((err, res) => {
          assert.equal(res.status, 200);
          const data = res.body;
          assert.equal(data.accessToken.length > 0, true);
          done();
        });
    });

    it("should return 401 when no refresh token is provided", done => {
      superagent.get(API_URL + "/user/refresh").end((err, res) => {
        assert.equal(res.status, 401);
        done();
      });
    });

    it("should return 403 when an invalid refresh token is provided", done => {
      superagent
        .get(API_URL + "/user/refresh")
        .set("Cookie", "refreshToken=invalidtoken; HttpOnly; Path=/;")
        .end((err, res) => {
          assert.equal(res.status, 403);
          done();
        });
    });

    it("should return 403 when the refresh token is expired", done => {
      const refreshToken = jwt.sign(
        { username: "testuser" },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "0s" }
      );

      superagent
        .get(API_URL + "/user/refresh")
        .set("Cookie", "refreshToken=invalidtoken; HttpOnly; Path=/;")
        .end((err, res) => {
          assert.equal(res.status, 403);
          done();
        });
    });
  });

  describe("Protected user routes", () => {
    it("should return 401 when no token is provided", done => {
      superagent.get(API_URL + "/user/123").end((err, res) => {
        assert.equal(res.status, 401);
        done();
      });
    });

    it("should return 403 when an invalid token is provided", done => {
      // Set an invalid token
      superagent
        .get(API_URL + "/user")
        .set("authorization", "Bearer invalidtoken")
        .end((err, res) => {
          assert.equal(res.status, 403);
          done();
        });
    });

    it("should return 403 when the token is expired", done => {
      const accessToken = jwt.sign(
        { username: "testuser" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "0s" }
      );

      superagent
        .get(API_URL + "/user")
        .set("authorization", "Bearer " + accessToken)
        .end((err, res) => {
          assert.equal(res.status, 403);
          done();
        });
    });
  });

  describe("Friend request routes", () => {
    describe("Sending friend requests endpoint", () => {
      it("should return 400 when no receiverId is provided", done => {
        const accessToken = generateAccessToken("testuser");
        superagent
          .post(API_URL + "/user/123/send-request")
          .set("authorization", "Bearer " + accessToken)
          .end((err, res) => {
            assert.equal(res.status, 400);
            done();
          });
      });

      it("should return 404 when the receiver does not exist", done => {
        const accessToken = generateAccessToken("testuser");
        superagent
          .post(API_URL + `/user/${new mongoose.Types.ObjectId()}/send-request`)
          .set("authorization", "Bearer " + accessToken)
          .send({ senderId: new mongoose.Types.ObjectId() })
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });

      it("should return 404 when the any of the ids are invalid", done => {
        const accessToken = generateAccessToken("testuser");
        superagent
          .post(API_URL + `/user/123/send-request`)
          .set("authorization", "Bearer " + accessToken)
          .send({ senderId: 321 })
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });

      it("should return 400 if the user try to send a request to themselves", done => {
        const accessToken = generateAccessToken("testuser");
        superagent
          .post(API_URL + `/user/123/send-request`)
          .set("authorization", "Bearer " + accessToken)
          .send({ senderId: 123 })
          .end((err, res) => {
            assert.equal(res.status, 400);
            done();
          });
      });

      it("should return 200 when the friend request is sent", async () => {
        // Generate access token for the testuser
        const accessToken = generateAccessToken("testuser");

        // Fetch user1
        const user1Response = await superagent
          .get(API_URL + "/user/username/testuser")
          .set("authorization", "Bearer " + accessToken);

        const user1 = user1Response.body[0];

        // Fetch user2
        const user2Response = await superagent
          .get(API_URL + "/user/username/testuser2")
          .set("authorization", "Bearer " + accessToken);

        const user2 = user2Response.body[0];

        // Send a friend request from user1 to user2
        const sendRequestResponse = await superagent
          .post(API_URL + `/user/${user2._id}/send-request`)
          .set("authorization", "Bearer " + generateAccessToken("testuser"))
          .send({ senderId: user1._id });

        // Assert that the request was successful (HTTP status code 200)
        assert.equal(sendRequestResponse.status, 200);

        // Check that the friend request was added to the receiver's friendRequests
        const user2UpdatedResponse = await superagent
          .get(API_URL + "/user/" + user2._id)
          .set("authorization", "Bearer " + accessToken);

        assert.equal(user2UpdatedResponse.body.friendRequests.length, 1);
        assert.equal(
          user2UpdatedResponse.body.friendRequests[0]._id,
          user1._id
        );

        // Check that the friend request was added to the sender's sentRequests
        const user1UpdatedResponse = await superagent
          .get(API_URL + "/user/" + user1._id)
          .set("authorization", "Bearer " + accessToken);

        assert.equal(user1UpdatedResponse.body.sentRequests.length, 1);
        assert.equal(user1UpdatedResponse.body.sentRequests[0]._id, user2._id);
      });

      it("should return 200 and set the users as friends if the the other user already sent a friend request", async () => {
        // Generate access token for the testuser
        const accessToken = generateAccessToken("testuser");

        // Fetch user1
        const user1Response = await superagent
          .get(API_URL + "/user/username/testuser")
          .set("authorization", "Bearer " + accessToken);

        const user1 = user1Response.body[0];

        // Fetch user2
        const user2Response = await superagent
          .get(API_URL + "/user/username/testuser2")
          .set("authorization", "Bearer " + accessToken);

        const user2 = user2Response.body[0];

        // Send a friend request from user2 to user1
        const sendRequestResponse = await superagent
          .post(API_URL + `/user/${user1._id}/send-request`)
          .set("authorization", "Bearer " + generateAccessToken("testuser"))
          .send({ senderId: user2._id });

        // Assert that the request was successful (HTTP status code 200)
        assert.equal(sendRequestResponse.status, 200);

        // Check that the friend request was added to the receiver's friendRequests
        const user2UpdatedResponse = await superagent
          .get(API_URL + "/user/" + user2._id)
          .set("authorization", "Bearer " + accessToken);

        assert.equal(user2UpdatedResponse.body.friendRequests.length, 0);
        assert.equal(user2UpdatedResponse.body.friends.length, 1);
        assert.equal(user2UpdatedResponse.body.friends[0]._id, user1._id);

        // Check that the friend request was added to the sender's sentRequests
        const user1UpdatedResponse = await superagent
          .get(API_URL + "/user/" + user1._id)
          .set("authorization", "Bearer " + accessToken);

        assert.equal(user1UpdatedResponse.body.sentRequests.length, 0);
        assert.equal(user1UpdatedResponse.body.friends.length, 1);
        assert.equal(user1UpdatedResponse.body.friends[0]._id, user2._id);
      });

      it("should return 200 and remove the users as friends if they already are friends", async () => {
        // Generate access token for the testuser
        const accessToken = generateAccessToken("testuser");

        // Fetch user1
        const user1Response = await superagent
          .get(API_URL + "/user/username/testuser")
          .set("authorization", "Bearer " + accessToken);

        const user1 = user1Response.body[0];

        // Fetch user2
        const user2Response = await superagent
          .get(API_URL + "/user/username/testuser2")
          .set("authorization", "Bearer " + accessToken);

        const user2 = user2Response.body[0];

        // Send a friend request from user2 to user1
        const sendRequestResponse = await superagent
          .post(API_URL + `/user/${user1._id}/send-request`)
          .set("authorization", "Bearer " + generateAccessToken("testuser"))
          .send({ senderId: user2._id });

        // Assert that the request was successful (HTTP status code 200)
        assert.equal(sendRequestResponse.status, 200);

        // Check that the friend request was added to the receiver's friendRequests
        const user2UpdatedResponse = await superagent
          .get(API_URL + "/user/" + user2._id)
          .set("authorization", "Bearer " + accessToken);

        assert.equal(user2UpdatedResponse.body.friends.length, 0);
        // Check that the friend request was added to the sender's sentRequests
        const user1UpdatedResponse = await superagent
          .get(API_URL + "/user/" + user1._id)
          .set("authorization", "Bearer " + accessToken);

        assert.equal(user1UpdatedResponse.body.friends.length, 0);
      });

      it("should return 200 and withdraw the request if the user already have sent a request to the other user", async () => {
        // Generate access token for the testuser
        const accessToken = generateAccessToken("testuser");

        // Fetch user1
        const user1Response = await superagent
          .get(API_URL + "/user/username/testuser")
          .set("authorization", "Bearer " + accessToken);

        const user1 = user1Response.body[0];

        // Fetch user2
        const user2Response = await superagent
          .get(API_URL + "/user/username/testuser2")
          .set("authorization", "Bearer " + accessToken);

        const user2 = user2Response.body[0];

        // Send a friend request from user2 to user1
        const sendRequestResponse = await superagent
          .post(API_URL + `/user/${user1._id}/send-request`)
          .set("authorization", "Bearer " + generateAccessToken("testuser"))
          .send({ senderId: user2._id });

        // Assert that the request was successful (HTTP status code 200)
        assert.equal(sendRequestResponse.status, 200);

        // Send a friend request from user2 to user1, should withdraw the request
        const withDrawResponse = await superagent
          .post(API_URL + `/user/${user1._id}/send-request`)
          .set("authorization", "Bearer " + generateAccessToken("testuser"))
          .send({ senderId: user2._id });

        assert.equal(withDrawResponse.status, 200);

        // Check that the friend request was added to the receiver's friendRequests
        const user2UpdatedResponse = await superagent
          .get(API_URL + "/user/" + user2._id)
          .set("authorization", "Bearer " + accessToken);

        assert.equal(user2UpdatedResponse.body.sentRequests.length, 0);

        // Check that the friend request was added to the sender's sentRequests
        const user1UpdatedResponse = await superagent
          .get(API_URL + "/user/" + user1._id)
          .set("authorization", "Bearer " + accessToken);

        assert.equal(user1UpdatedResponse.body.friendRequests.length, 0);
      });
    });

    describe("Accepting friend requests endpoint", () => {});

    describe("Declining friend requests endpoint", () => {});
  });

  describe("Logout route", () => {
    it("should return 401 when no refresh token is provided", done => {
      superagent.get(API_URL + "/user/logout").end((err, res) => {
        assert.equal(res.status, 401);
        done();
      });
    });

    it("should return 403 when an invalid refresh token is provided", done => {
      superagent
        .get(API_URL + "/user/logout")
        .set("Cookie", "refreshToken=invalidtoken; HttpOnly; Path=/;")
        .end((err, res) => {
          assert.equal(res.status, 403);
          done();
        });
    });

    it("should return 200 and clear the refreshToken cookie", done => {
      const refreshToken = generateRefreshToken("testuser");

      superagent
        .get(API_URL + "/user/logout")
        .set("Cookie", "refreshToken=" + refreshToken + "; HttpOnly; Path=/;")
        .end((err, res) => {
          assert.equal(res.status, 204);
          assert.equal(
            res.headers["set-cookie"][0].includes("refreshToken=;"),
            true
          );
          done();
        });
    });
  });
});
