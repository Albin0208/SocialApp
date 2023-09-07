import express from 'express';
import { getAll, getOne, insertOne, update, connect } from './database.js';

const router = express.Router();

function logError(err) {
  console.error(err);
}

// Get all messages
router.route('/messages')
  .get(async (req, res) => {
    try {
      const tweets = await getAll();
      res.status(200).json({ data: tweets });
    } catch (error) {
      logError(error);
      res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
    }
  })
  .post(async (req, res) => {
    // Deconstruct the message object
    const { message, author, read, timestamp } = req.body;
  
    // Validate message, author, and timestamp
    if (!message || message.length > 140 || !author || !timestamp) {
      return res.status(500).json({ error: 'Invalid message, author, or timestamp' });
    }
  
    // Validate read value
    if (typeof read !== 'boolean') {
      return res.status(500).json({ error: 'Invalid read value' });
    }
  
    try {
      const result = await insertOne(req.body);
      if (result.acknowledged) {
        res.status(201).json({ data: { id: result.insertedId } });
      } else {
        throw new Error('Failed to create message');
      }
    } catch (error) {
      logError(error);
      res.status(500).json({ error: 'Could not create new message', message: error.message });
    }
  });

router.route('/message/:id')
  .get(async (req, res) => {
    try {
      const tweet = await getOne(req.params.id);
      if (!tweet) {
        return res.status(404).json({ error: `Message id: ${req.params.id} not found` });
      }
      res.status(200).json({ data: tweet });
    } catch (error) {
      logError(error);
      res.status(500).json({ error: 'Failed to fetch message', message: error.message });
    }
  })
  .patch(async (req, res) => {
    if (typeof req.body.read !== 'boolean') {
      return res.status(500).json({ error: 'Invalid read value' });
    }

    try {
      await update({ _id: req.params.id, read: req.body.read });
      res.status(200).json({ message: `Message id: ${req.params.id} updated` });
    } catch (error) {
      logError(error);
      res.status(500).json({ error: 'Could not update message', message: error.message });
    }
  });

// Catch-all route for invalid routes and methods
router.route('*')
  .get((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  })
  .all((req, res) => {
    res.status(405).json({ error: 'Method Not Allowed', method: req.method });
  });

export default router;
