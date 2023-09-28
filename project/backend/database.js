import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/";
let dbName = "tdp013";

const connect = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(MONGODB_URI + dbName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
};

const closeDb = async () => {
  await mongoose.connection.close();
  console.log("Closed database connection");
};

const setDb = name => {
  dbName = name;
};

const purgeDatabase = async () => {
  // Get a list of all collection names in the database
  const collections = await mongoose.connection.db.collections();

  // Loop through the collections and drop each one
  for (const collection of collections) {
    await collection.drop();
  }

  console.log(`All collections in ${dbName} database have been purged.`);
};

export { connect, closeDb, setDb, purgeDatabase };
