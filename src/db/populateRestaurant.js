const {
  connectToDatabase,
  disconnectFromDatabase,
  Restaurant,
} = require("./mongoDB");
const { fetchRestaurantsFromGoogle } = require("../services/googleMaps");

// This function will replace the "Restaurant Collection" with the latest data from Google Maps.
async function populateRestaurantsCollection() {
  // Currently, only 60 restaurants are limited by Google Maps API
  const restaurants = await fetchRestaurantsFromGoogle();
  console.log(`Fetched ${restaurants.length} restaurants from Google Maps.`);
  // Solutions to increase number of restaurants:
  // 1. Use different queries to cover more areas (e.g., "restaurants near UCLA", "restaurants in Los Angeles", etc.)
  // 2. Use Google Places Nearby Search API with multiple locations and radii to gather more data points.

  await Restaurant.deleteMany({});
  console.log("Cleared existing restaurants collection.");

  if (restaurants.length === 0) {
    console.log("No restaurants returned by Google Maps. Skipping insert."); // if this error occurs: the query probably has a problem or there are no restaurants found
    return;
  }

  await Restaurant.insertMany(restaurants, { ordered: false });
  console.log("Saved restaurants to MongoDB.");
}

// Coordinates database connection lifecycle for the populate workflow.
async function runPopulateScript() {
  try {
    await connectToDatabase();
    console.log("Connected to MongoDB cluster.");

    await populateRestaurantsCollection();
  } catch (error) {
    console.error("Failed to populate restaurants:", error);
  } finally {
    await disconnectFromDatabase();
  }
}

runPopulateScript();

// Workflow : first we check connection to DB through runPopulateScript()
// then we fetch restaurants from Google Maps through populateRestaurantsCollection()
// then we clear existing restaurants and insert new ones
