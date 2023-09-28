import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/";
let dbName = "tdp013";

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>} A Promise that resolves when the connection is established.
 * @throws {Error} If the connection fails.
 */
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

/**
 * Closes the database connection.
 * @async
 * @function closeDb
 * @returns {Promise<void>}
 */
const closeDb = async () => {
  await mongoose.connection.close();
  console.log("Closed database connection");
};

/**
 * Sets the name of the database to be used.
 * @param {string} name - The name of the database.
 */
const setDb = name => {
  dbName = name;
};

/**
 * Deletes all collections in the database.
 * @returns {Promise<void>}
 */
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
