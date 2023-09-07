import express from 'express';
import { getAll, getOne, insertOne, update, connect } from './database.js';

const router = express.Router();

router.route('/messages')
  .get(async (req, res) => {
    const tweets = await getAll();

    res.status(200).json({ tweets: tweets });
  })
  .post(async (req, res) => {
    // Validate req.body
    if (!req.body.message || req.body.message.length > 140)
      return res.status(500).json({ 
        message: 'Error: Wrong message length, expected message to be between 1 and 140 characters' 
      });

      if (!req.body.author)
      return res.status(500).json({ 
        message: 'Error: Expected an author' 
      });

      // TODO Create a timestamp, used for testing
      req.body.timestamp = Date.now();

      // Check if the timestamp is valid
      if (new Date(req.body.timestamp) == 'Invalid Date') {
        return res.status(500).json({ 
          message: 'Error: Invalid timestamp' 
        });
      }

    const result = await insertOne(req.body);
    if (!result.acknowledged)
      return res.status(500).json({ message: 'Error: Could not create new message' });

    res.status(200).json({ id: result.insertedId });
  });

router.route('/message/:id')
  .get(async (req, res) => {
    const tweet = await getOne(req.params.id);
    if (!tweet) 
      return res.status(404).json({ message: `Error: Message id: ${req.params.id} not found` });

    res.status(200).json({ tweet: tweet });
  })
  .patch(async(req, res) => {
    if (!req.body.hasOwnProperty('read'))
      return res.status(500).json({ 
        message: 'Error: Expected a read boolean' 
      });

    if (typeof req.body.read !== 'boolean')
      return res.status(500).json({ 
        message: 'Error: Expected a read to have a boolean value'
      });

      try {
        await update({ _id: req.params.id, read: req.body.read });
      } catch (err) {
        return res.status(500).json({ message: 'Error: Could not update message' });
      }

    res.status(200).json({ message: `Message id: ${req.params.id} updated` });
  });

router.route('*')
  .get((req, res) => {
    res.status(404).json({ message: 'Error: not a valid route' });
  })
  .all((req, res) => {
    res.status(405).json({ message: 'Error: Invalid method', method: req.method });
  });

export default router;
