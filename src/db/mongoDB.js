const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Defines the Restaurant schema and model. (ps. let me know if there are any other fields we want to add)
const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: Number,
  place_id: String,
  types: [String],
  geometry: {
    location: {
      lat: Number,
      lng: Number,
    },
  },
});

const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);

// Connects to MongoDB using the connection string from the .env file (currently Eric's cluster)
async function connectToDatabase() {
  // connecting DB_URI from .env to actual Database
  const connectionUri = process.env.DB_URI;

  // check if connectionUri is defined
  if (!connectionUri) {
    throw new Error("DB_CONNECTION is not defined in the environment");
  }

  // reuse existing connection if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // establish new connection
  await mongoose.connect(connectionUri);
  return mongoose.connection;
}

// Closes the active MongoDB connection if one exists.
async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  Restaurant,
};

// THINGS TO CHECK IF CONNECTION FAILS:
// 1. Make sure MongoDB is running (if using local instance)
// 2. Ensure network connectivity to the MongoDB server
// 3. If still outputs FAIL, check the DB_URI in .env file

// Test Connection with your own database with the following code:
// THIS SHELL CODE--> node src/db/populateRestaurant.js <-- It will attempt to connect and populate the DB
