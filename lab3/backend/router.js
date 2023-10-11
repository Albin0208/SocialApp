import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import { escape } from "html-escaper";

import {
  getAll,
  getOne,
  insertOne,
  update,
} from "./database.js";

const router = express.Router();

function logError(err) {
  console.error(err);
}

// Get all messages
router
  .route("/messages")
  .get((req, res) => {
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
  .post((req, res) => {
    if (mongoSanitize.has(req.body)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Deconstruct the message object
    const { message, author, read } = req.body;

    // Validate message, author
    if (!message || message.length > 140 || !author) {
      return res.status(400).json({ error: "Invalid message or author" });
    }

    if (typeof message !== "string" || typeof author !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid message or author type, expected a string" });
    }

    // Validate read value
    if (typeof read !== "boolean") {
      return res
        .status(400)
        .json({ error: "Invalid read value, expected value of type bool" });
    }

    const timestamp = Date.now();

    insertOne({
      message: escape(message),
      author: escape(author),
      read,
      timestamp,
    })
      .then(result => {
        if (result.acknowledged) {
          res.status(201).json({ data: { id: result.insertedId } });
        } else {
          throw new Error("Failed to create message");
        }
      })
      .catch(error => {
        logError(error);
        res.status(500).json({
          error: "Could not create new message",
          message: error.message,
        });
      });
  });

router
  .route("/messages/:id")
  .get((req, res) => {
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
  .patch((req, res) => {
    if (mongoSanitize.has(req.body)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    if (typeof req.body.read !== "boolean") {
      return res
        .status(500)
        .json({ error: "Invalid read value, expected value of type bool" });
    }
    update({ _id: req.params.id, read: req.body.read })
      .then(result => {
        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ error: `Message id: ${req.params.id} not found` });
        }
        res.status(200).json({
          message: `Message id: ${req.params.id} updated`,
          id: req.params.id,
        });
      })
      .catch(error => {
        logError(error);
        res
          .status(500)
          .json({ error: "Could not update message", message: error.message });
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
