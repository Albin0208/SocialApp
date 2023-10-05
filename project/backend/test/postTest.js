import superagent from "superagent";
import jwt from "jsonwebtoken";
import "dotenv/config";
import assert from "assert";
import mongoose from "mongoose"; // Import mongoose for ObjectId
import { closeDb, setDb, purgeDatabase } from "../database.js";
import { startServer } from "../server.js";

let server;

const API_URL = "http://localhost:5000";

const generateAccessToken = username => {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

describe("Post routes", () => {
  before(async () => {
    setDb("testdb");
    server = await startServer();
    await purgeDatabase();
  });

  after(async () => {
    await purgeDatabase();
    closeDb();
    await server.close();
  });

  describe("Create a Post", () => {
    it("should return 201 and the created post", done => {
      const newPost = {
        content: "This is a test post.",
        author: new mongoose.Types.ObjectId(), // Generate a valid ObjectId
      };

      const accessToken = generateAccessToken("testuser");

      superagent
        .post(API_URL + "/posts/create")
        .set("authorization", "Bearer " + accessToken)
        .send(newPost)
        .end((err, res) => {
          assert.equal(res.status, 201);
          const data = res.body;
          assert.equal(data.content, newPost.content);
          assert.equal(data.author.toString(), newPost.author.toString()); // Compare ObjectId as strings
          done();
        });
    });

    it("should return 400 when content is missing", done => {
      const invalidPost = {
        author: new mongoose.Types.ObjectId(),
      };

      const accessToken = generateAccessToken("testuser");

      superagent
        .post(API_URL + "/posts/create")
        .set("authorization", "Bearer " + accessToken)
        .send(invalidPost)
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });

    it("should return 400 when author is missing", done => {
      const invalidPost = {
        content: "This is another test post.",
      };

      const accessToken = generateAccessToken("testuser");

      superagent
        .post(API_URL + "/posts/create")
        .set("authorization", "Bearer " + accessToken)
        .send(invalidPost)
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
  });

  describe("Get posts", () => {
    it("should return 200 and an array of posts", done => {
      const accessToken = generateAccessToken("testuser");

      superagent
        .get(API_URL + "/posts")
        .set("authorization", "Bearer " + accessToken)
        .end((err, res) => {
          assert.equal(res.status, 200);
          const data = res.body;
          assert.equal(Array.isArray(data), true);
          done();
        });
    });

    it("should return 200 and a single post", done => {
      const newPost = {
        content: "This is a test post.",
        author: new mongoose.Types.ObjectId(), // Generate a valid ObjectId
      };

      const accessToken = generateAccessToken("testuser");

      // Insert the post into the database
      superagent
        .post(API_URL + "/posts/create")
        .set("authorization", "Bearer " + accessToken)
        .send(newPost)
        .end((err, res) => {
          assert.equal(res.status, 201);
          const id = res.body._id;

          superagent
            .get(API_URL + "/posts/" + id)
            .set("authorization", "Bearer " + accessToken)
            .end((err, res) => {
              assert.equal(res.status, 200);
              const data = res.body;
              assert.equal(data.content, newPost.content);
              assert.equal(data.author.toString(), newPost.author.toString()); // Compare ObjectId as strings
              done();
            });
        });
    });

    it("should return 404 when post is not found", done => {
      const accessToken = generateAccessToken("testuser");

      superagent
      .get(API_URL + "/posts/123")
      .set("authorization", "Bearer " + accessToken)
      .end((err, res) => {
        assert.equal(res.status, 404);
        done();
      });
    })
  });
});
