const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const API_BASE = process.env.GOOGLE_MAPS_API_BASE;
const DEFAULT_QUERY = process.env.GOOGLE_MAPS_DEFAULT_QUERY;

// Retrieves restaurants from the Google Maps API using the provided query.
async function fetchRestaurantsFromGoogle(query = DEFAULT_QUERY) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // Validate that the API key is available ( currently using Shuan's google maps API key )
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not defined in the .env file.");
  }

  const collectedResults = [];
  let nextPageToken = null;

  do {
    let url;

    if (nextPageToken) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      url = `${API_BASE}?pagetoken=${nextPageToken}&key=${apiKey}`;
    } else {
      url = `${API_BASE}?query=${encodeURIComponent(query)}&key=${apiKey}`;
    }

    const { data } = await axios.get(url);

    if (data.error_message) {
      throw new Error(data.error_message);
    }

    if (Array.isArray(data.results) && data.results.length > 0) {
      collectedResults.push(...data.results);
    }

    nextPageToken = data.next_page_token || null;
  } while (nextPageToken);

  return collectedResults;
}

module.exports = {
  fetchRestaurantsFromGoogle,
};
