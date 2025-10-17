const { Client } = require("@googlemaps/google-maps-services-js");
const { googleMapsApiKey } = require("../config");

const client = new Client({});

/**
 * Performs a Places Text Search request through the Google Maps client using the API key.
 * Returns the raw client response so callers can decide how to handle the data.
 */
async function textSearch(query) {
  if (!googleMapsApiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not defined. Did you set it in your environment?");
  }

  return client.textSearch({
    params: {
      query,
      key: googleMapsApiKey
    }
  });
}

module.exports = {
  textSearch
};
