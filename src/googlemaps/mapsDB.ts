const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../../.env" });

const DB = process.env.DB_CONNECTION;

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DB);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Connection error:", err);
  }
})();