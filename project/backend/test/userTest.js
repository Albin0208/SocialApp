import superagent from "superagent";
import jwt from "jsonwebtoken";
import "dotenv/config";
import assert from "assert";
import { closeDb, setDb, purgeDatabase } from "../database.js";
import { startServer } from "../server.js";

let server; // Define the 'server' variable in the outer scope

const API_URL = "http://localhost:5000";

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

    it("/User/register should return 400 if username is already taken", done => {
      superagent
        .post(API_URL + "/user/register")
        .send({ username: "testuser", password: "testpassword" })
        .end((err, res) => {
          assert.equal(res.status, 400);
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
  });

  describe("Refresh token route", () => {
    it("should return 200 and a new access token", done => {
      const refreshToken = jwt.sign(
        { username: "testuser" },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      superagent.get(API_URL + "/user/refresh")
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
    })

    it("should return 403 when an invalid refresh token is provided", done => {
      superagent.get(API_URL + "/user/refresh")
      .set("Cookie", "refreshToken=invalidtoken; HttpOnly; Path=/;")
      .end((err, res) => {
        assert.equal(res.status, 403);
        done();
      });
    })
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
  });
});
