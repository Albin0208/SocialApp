import superagent from "superagent";
import assert from "assert";
import { startServer } from "../server.js";
import { setDbForTesting, purgeDatabase, insertOne } from "../database.js";

let server;
let api = "http://localhost:5000";

describe("server API test", () => {
  before(done => {
    const config = {
      port: 5000,
    };
    // Set the database to testing db
    setDbForTesting("testdb");

    server = startServer(config, done);
  });

  beforeEach(() => {
    // Delete all entries in the database
    purgeDatabase();
  });

  describe("GET /messages", () => {
    it("/GET. Get all messages should return 200 and data of type array", done => {
      superagent.get(api + "/messages").end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(res.body.data), true);
        assert.equal(res.body.data.length, 0);
        done();
      });
    });

    it("/GET. Get all messages should return 200 and data of type array", done => {
      insertOne({
        message: "Hello World",
        author: "Test",
        timestamp: new Date(),
        read: false,
      }).then(id => {
        superagent
          .get(api + "/message/" + id.insertedId.toString())
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(typeof res.body.data, "object");
            assert.equal(res.body.data.message, "Hello World");
            assert.equal(res.body.data.author, "Test");
            assert.equal(res.body.data.read, false);
            assert.equal(typeof res.body.data.timestamp, "string");
            done();
          });
      });
    });

    it("/GET. Try getting tweet that does not exits", done => {
      superagent
        .get(api + "/message/" + "5f9b3b3b3b3b3b3b3b3b3b3b")
        .end((err, res) => {
          assert.equal(res.status, 404);
          done();
        });
    });
  });

  describe("POST /messages", () => {
    it("/POST. Post a message should return 201 and data of type object", done => {
      superagent
        .post(api + "/messages")
        .send({
          message: "Hello World",
          author: "Test",
          read: false,
          timestamp: new Date(),
        })
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.equal(typeof res.body.data, "object");
          const id = res.body.data.id;

          superagent.get(api + "/message/" + id).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.data.message, "Hello World");
            assert.equal(res.body.data.author, "Test");
            assert.equal(res.body.data.read, false);
            assert.equal(typeof res.body.data.timestamp, "string");
            done();
          });
        });
    });

    it("/POST. Post a message with wrong input (no author) should return 500", done => {
      superagent
        .post(api + "/messages")
        .send({
          message: "Hello World",
          read: false,
          timestamp: new Date(),
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });

    it("/POST. Post a message with wrong input (no read) should return 500", done => {
      superagent
        .post(api + "/messages")
        .send({
          message: "Hello World",
          author: "Test",
          timestamp: new Date(),
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });

    it("/POST. Post a message with wrong input (no message) should return 500", done => {
      superagent
        .post(api + "/messages")
        .send({
          author: "Test",
          read: false,
          timestamp: new Date(),
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });

    it("/POST. Post a message with wrong input (no timestamp) should return 500", done => {
      superagent
        .post(api + "/messages")
        .send({
          message: "Hello World",
          read: false,
          author: "Test",
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });

    it("/POST. Post a message with incorrect message (empty message) should return 500", done => {
      superagent
        .post(api + "/messages")
        .send({
          message: "",
          read: false,
          author: "Test",
          timestamp: new Date(),
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });

    it("/POST. Post a message with incorrect message (to long) should return 500", done => {
      superagent
        .post(api + "/messages")
        .send({
          message:
            "This is a very long tweet. " /
            "It is more than 140 characters and should cause and error and not be accepted. " /
            "It is very hard to think of good things to write.",
          read: false,
          author: "Test",
          timestamp: new Date(),
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });

    it("POST /messages. Post a message with incorrect timestamp (wrong format) should return 500", done => {
      superagent
        .post(api + "/messages")
        .send({
          message: "Hello World",
          read: false,
          author: "Test",
          timestamp: "-abc",
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });
  });

  describe("PATCH /message/:id", () => {
    // TODO Test update tweet
    it("/PATCH. Update a tweet should return 200 and data of type object", done => {
      insertOne({
        message: "Hello World",
        author: "Test",
        timestamp: new Date(),
        read: false,
      }).then(id => {
        superagent
          .patch(api + "/message/" + id.insertedId.toString())
          .send({
            read: true,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            const id = res.body.id;

            superagent.get(api + "/message/" + id).end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.data.read, true);
              done();
            });
          });

        // TODO Test patch with wrong input
        // TODO Test patch with wrong id
      });
    });
  });

  describe("Test invalid routes and params", () => {
    it("GET /message should return 404", done => {
      superagent.get(api + "/wrong").end((err, res) => {
        assert.equal(res.status, 404);
        done();
      });
    });

    it("All other methods on / should return 405", done => {
      superagent.post(api + "/").end((err, res) => {
        assert.equal(res.status, 405);
        done();
      });
    });
  });

  after(done => {
    console.log("Done");
    server.close(() => done());
  });
});
