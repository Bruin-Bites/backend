const {
  connectToDatabase,
  disconnectFromDatabase,
  Restaurant,
} = require("./mongoDB");
const { fetchRestaurantsFromGoogle } = require("../services/googleMaps");

// Normalizes the Google Maps restaurant payload into our schema shape.
function normalizeRestaurant(restaurant) {
  const location = restaurant.geometry?.location;
  const latValue =
    typeof location?.lat === "function" ? location.lat() : location?.lat;
  const lngValue =
    typeof location?.lng === "function" ? location.lng() : location?.lng;

  const normalized = {
    name: restaurant.name,
    address:
      restaurant.formatted_address || restaurant.vicinity || undefined,
    rating:
      typeof restaurant.rating === "number" ? restaurant.rating : undefined,
    place_id: restaurant.place_id,
    types: Array.isArray(restaurant.types) ? restaurant.types : undefined,
  };

  if (latValue !== undefined && lngValue !== undefined) {
    normalized.geometry = {
      location: {
        lat: latValue,
        lng: lngValue,
      },
    };
  }

  return normalized;
}

// This function will replace the "Restaurant Collection" with the latest data from Google Maps.
async function populateRestaurantsCollection() {
  // Currently, only 60 restaurants are limited by Google Maps API
  const rawRestaurants = await fetchRestaurantsFromGoogle();
  const restaurants = rawRestaurants
    .map(normalizeRestaurant)
    .filter((restaurant) => restaurant.name && restaurant.address);

  console.log(
    `Fetched ${rawRestaurants.length} restaurants from Google Maps. ${restaurants.length} contain address data.`
  );
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
