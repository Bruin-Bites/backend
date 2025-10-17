const mongoose = require("mongoose");
const { mongoUri } = require("../config");

let connectionPromise;

/**
 * Opens (or reuses) a single MongoDB connection for the entire application lifecycle.
 * Reusing the promise prevents creating new connections on every import in serverless contexts.
 */
async function connectToDatabase() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined. Did you set it in your environment?");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    mongoose.connection.on("error", error => {
      console.error("MongoDB connection error", error);
    });
  }

  return connectionPromise;
}

module.exports = {
  connectToDatabase
};
