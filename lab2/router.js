import express from "express";
import {
  getAll,
  getOne,
  insertOne,
  update,
  purgeDatabase,
} from "./database.js";

const router = express.Router();

function logError(err) {
  console.error(err);
}

// Get all messages
router
  .route("/messages")
  .get(async (req, res) => {
    getAll()
      .then(tweets => {
        res.status(200).json({ data: tweets });
      })
      .catch(error => {
        logError(error);
        res
          .status(500)
          .json({ error: "Failed to fetch messages", message: error.message });
      });
  })
  .post(async (req, res) => {
    // Deconstruct the message object
    const { message, author, read, timestamp } = req.body;

    // Validate message, author, and timestamp
    if (!message || message.length > 140 || !author) {
      return res
        .status(500)
        .json({ error: "Invalid message, author, or timestamp" });
    }

    if (new Date(timestamp).toString() === "Invalid Date") {
      return res.status(500).json({ error: "Invalid timestamp" });
    }

    // Validate read value
    if (typeof read !== "boolean") {
      return res.status(500).json({ error: "Invalid read value" });
    }

    insertOne(req.body)
      .then(result => {
        if (result.acknowledged) {
          res.status(201).json({ data: { id: result.insertedId } });
        } else {
          throw new Error("Failed to create message");
        }
      })
      .catch(error => {
        logError(error);
        res
          .status(500)
          .json({
            error: "Could not create new message",
            message: error.message,
          });
      });
  });

router
  .route("/message/:id")
  .get(async (req, res) => {
    getOne(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res
            .status(404)
            .json({ error: `Message id: ${req.params.id} not found` });
        }
        res.status(200).json({ data: tweet });
      })
      .catch(error => {
        logError(error);
        res
          .status(500)
          .json({ error: "Failed to fetch message", message: error.message });
      });
  })
  .patch(async (req, res) => {
    if (typeof req.body.read !== "boolean") {
      return res.status(500).json({ error: "Invalid read value" });
    }
    update({ _id: req.params.id, read: req.body.read })
      .then(result => {
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ error: `Message id: ${req.params.id} not found` });
        }
        res
          .status(200)
          .json({ message: `Message id: ${req.params.id} updated`, id: req.params.id });
      })
      .catch(error => {
        logError(error);
        res
          .status(500)
          .json({ error: "Could not update message", message: error.message });
      });
  });

router.route("/purge").delete(async (req, res) => {
  purgeDatabase()
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "No messages found" });
      }
      res.status(200).json({ message: "Database purged" });
    })
    .catch(error => {
      logError(error);
      res
        .status(500)
        .json({ error: "Failed to purge database", message: error.message });
    });
});

// Catch-all route for invalid routes and methods
router
  .route("*")
  .get((req, res) => {
    res.status(404).json({ error: "Not Found" });
  })
  .all((req, res) => {
    res.status(405).json({ error: "Method Not Allowed", method: req.method });
  });

export default router;
