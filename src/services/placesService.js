const Place = require("../models/Place");
const { textSearch } = require("../lib/googleMaps");

/**
 * Calls Google Places Text Search with the provided query and stores/updates results in MongoDB.
 * Returns the normalized Place documents so routes can respond with consistent data.
 */
async function searchAndPersistPlaces(query) {
  if (!query || typeof query !== "string") {
    throw new Error("A non-empty search query is required");
  }

  const { data } = await textSearch(query);
  const results = data?.results || [];

  const persistedPlaces = await Promise.all(
    results.map(async place => {
      const normalized = {
        placeId: place.place_id,
        name: place.name,
        formattedAddress: place.formatted_address,
        location: place.geometry?.location
          ? {
              type: "Point",
              coordinates: [place.geometry.location.lng, place.geometry.location.lat]
            }
          : undefined,
        rating: place.rating,
        types: place.types,
        raw: place
      };

      return Place.findOneAndUpdate(
        { placeId: normalized.placeId },
        normalized,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
    })
  );

  return persistedPlaces;
}

module.exports = {
  searchAndPersistPlaces
};
