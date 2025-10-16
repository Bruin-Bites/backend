const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../../.env" });

// ✅ Constants
const DB = process.env.DB_CONNECTION;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const API_BASE = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const QUERY = "restaurants in Westwood Los Angeles";

// ✅ Mongoose schema (optional, for saving results)
const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: Number,
  place_id: String,
  types: [String],
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// Connect to MongoDB
(async () => {
  try {
    if (!DB) throw new Error("DB_CONNECTION not found in .env file");

    console.log("Connecting to MongoDB...");
    await mongoose.connect(DB);
    console.log("✅ Connected to MongoDB");

    const results = await getRestaurants();
    console.log(`Fetched ${results.total} restaurants from Google Maps.`);

    // Optional: Save to MongoDB
    await Restaurant.insertMany(results.results, { ordered: false });
    console.log("✅ Saved all restaurants to MongoDB!");
  } catch (err) {
    console.error("❌ Connection or fetching error:", err);
  } finally {
    mongoose.connection.close();
  }
})();

// ✅ Fetch function
async function getRestaurants() {
  let westwoodRestaurants = [];
  let nextPageToken = null;

  try {
    do {
      let url;

      if (nextPageToken) {
        // Google API requires a small delay before using next_page_token
        await new Promise((resolve) => setTimeout(resolve, 3000));
        url = `${API_BASE}?pagetoken=${nextPageToken}&key=${GOOGLE_API_KEY}`;
      } else {
        url = `${API_BASE}?query=${encodeURIComponent(QUERY)}&key=${GOOGLE_API_KEY}`;
      }

      const { data }: { data: any } = await axios.get(url);

      console.log(
        `Fetched ${data.results?.length || 0} results, total so far: ${westwoodRestaurants.length}`
      );

      if (data.results && data.results.length > 0) {
        westwoodRestaurants.push(...data.results);
      }

      nextPageToken = data.next_page_token || null;
    } while (nextPageToken);

    return {total: westwoodRestaurants.length, results: westwoodRestaurants,};
  } catch (err: any) {
    console.error("Error fetching restaurants:", err.message);
    return { total: 0, results: [] };
  }
  
}
