import superagent from "superagent";
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

  after(done => {
    closeDb(); // Close the database connection
    server.close(() => done()); // Close the Express server using the 'server' variable
  });

  it("/User/register should return 201 and the user object", done => {
    superagent
      .post(API_URL + "/user/register")
      .send({ username: "testuser", password: "testpassword" })
      .end((err, res) => {
        console.log(res.body);
        assert.equal(res.status, 201);
        done();
      });
  });

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


