const { Router } = require("express");
const { searchAndPersistPlaces } = require("../services/placesService");

const router = Router();

/**
 * Handles location search requests by calling Google Maps and saving the results to MongoDB.
 * Responds with a lightweight view of each place so clients do not receive the full raw payload.
 */
router.post("/search", async (req, res, next) => {
  try {
    const { query } = req.body || {};

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Body must include a non-empty 'query' string." });
    }

    const places = await searchAndPersistPlaces(query.trim());

    res.json({
      count: places.length,
      places: places.map(place => ({
        id: place.placeId,
        name: place.name,
        formattedAddress: place.formattedAddress,
        location: place.location,
        rating: place.rating,
        types: place.types
      }))
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
