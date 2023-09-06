import { MongoClient } from 'mongodb';

let client;
let db;

function connectToDatabase(config, callback) {
  if (db) return;

  let uri;
	if(config.user){
		uri = `mongodb://${config.user}:${config.pass}@${config.host}/${config.options || ''}`;
	} else {
		uri = `mongodb://${config.host}/${config.options || ''}`;
	}
	client = new MongoClient(uri);
	db = client.db(config.db);
	callback && callback();

}

function closeDatabaseConnection() {
	if(client){
		client.close();
		db = null;
	}
	callback && callback();

}

function getDatabase() {
  return db;
}

export { connectToDatabase, closeDatabaseConnection, getDatabase };