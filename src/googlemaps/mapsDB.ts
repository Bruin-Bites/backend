const mongoose = require("mongoose");

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect("mongodb://localhost:27017/bruinbites");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
})();