import { MongoClient, ObjectId } from 'mongodb';

let client;
let db;

async function connect() {
  try {
    if (!client) {
      client = await MongoClient.connect('mongodb://127.0.0.1:27017');
      db = client.db('tdp013');
    }
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error; // Rethrow the error for the caller to handle
  }
}

async function getAll() {
  try {
    await connect();
    return await db.collection('tweets').find({}).toArray();
  } catch (error) {
    console.error('Failed to fetch all tweets:', error);
    throw error;
  }
}

async function getOne(id) {
  try {
		console.log("pre search");
    if (!ObjectId.isValid(id)) return null;
    await connect();
		console.log("search");
    return await db.collection('tweets').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Failed to fetch a tweet by ID:', error);
    throw error;
  }
}

async function insertOne(tweet) {
  try {
    await connect();
    return await db.collection('tweets').insertOne(tweet);
  } catch (error) {
    console.error('Failed to insert a tweet:', error);
    throw error;
  }
}

async function update(tweet) {
  try {
    if (!ObjectId.isValid(tweet._id)) return null;
    await connect();
    return await db.collection('tweets').updateOne(
      { _id: new ObjectId(tweet._id) },
      { $set: { read: tweet.read } }
    );
  } catch (error) {
    console.error('Failed to update a tweet:', error);
    throw error;
  }
}

export { getAll, getOne, insertOne, update, connect };
