import { MongoClient, ObjectId } from 'mongodb';

let client;
let db;

function connectToDatabase() {
	client = new MongoClient('mongodb://localhost:27017');
	db = client.db('tdp013');
	return db;
}

async function getAll() {
	if (!db) await connect();

	return await db.collection('tweets').find({}).toArray();
}

async function getOne(id) {
	// Check if the id is valid
	if (!ObjectId.isValid(id)) return null;

	if (!db) await connect();

	const result = await db.collection('tweets').find({ _id: new ObjectId(id) }).toArray();
	return result[0];
}

async function insertOne(tweet) {
	if (!db) await connect();

	return await db.collection('tweets').insertOne(tweet);
}

async function update(tweet) {
	if (!ObjectId.isValid(tweet._id)) return null;

	if (!db) await connect();

	return await db.collection('tweets').updateOne({ _id: new ObjectId(tweet._id) }, { $set:{ read: tweet.read }});
}

async function connect() {
	client = await MongoClient.connect('mongodb://localhost:27017');
	db = client.db('tdp013');
}

export { getAll, getOne, insertOne, update, connect, connectToDatabase };