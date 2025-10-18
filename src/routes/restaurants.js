const { Router } = require("express");
const axios = require("axios");
require("dotenv").config();

const router = Router();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
// UCLA coordinates for default origin
const UCLA_COORD = "34.0689,-118.4452";
const MAX_DESTINATIONS = 25;

router.get("/", async (req, res) => {
  try {
    const {
      connectToDatabase,
      disconnectFromDatabase,
      Restaurant,
    } = require("../db/mongoDB");

    await connectToDatabase();
    const restaurants = await Restaurant.find({});
    await disconnectFromDatabase();

    // Filter out restaurants without address or place_id
    const validRestaurants = restaurants.filter((r) => r.address || r.place_id);

    const results = [];

    // Process in batches to respect API limits 25 destinations per request
    for (let i = 0; i < validRestaurants.length; i += MAX_DESTINATIONS) {
      const batch = validRestaurants.slice(i, i + MAX_DESTINATIONS);

      // Use place_id if available, fallback to address
      const destinations = batch
        .map((r) =>
          r.place_id
            ? `place_id:${r.place_id}`
            : encodeURIComponent(r.address || "")
        )
        .join("|");
      // Construct the Distance Matrix API URL
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${UCLA_COORD}&destinations=${destinations}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

      // Make the API call
      const response = await axios.get(url);
      const data = response.data;

      // Validate response before accessing rows
      if (!data || !data.rows || !data.rows[0] || !data.rows[0].elements) {
        console.warn("Unexpected response structure:", data);
        continue;
      }

      // Extract distance elements
      const elements = data.rows[0].elements;

      // Merge distance info back into restaurant data
      batch.forEach((r, idx) => {
        const info = elements[idx];
        if (info && info.status === "OK") {
          results.push({
            ...r.toObject(),
            distance_text: info.distance.text,
            distance_value: info.distance.value,
            duration_text: info.duration.text,
            duration_value: info.duration.value,
          });
        } else {
          results.push({ ...r.toObject(), distance_text: null });
        }
      });
    }
    // currently limmited to 60 restaurants due to Google Maps API
    console.log(`Successfully processed ${results.length} restaurants`);
    res.json(results);
  } catch (error) {
    console.error("Error fetching restaurants:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
