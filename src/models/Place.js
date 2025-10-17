const { Schema, model, models } = require("mongoose");

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere"
  }
});

const placeSchema = new Schema(
  {
    placeId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    formattedAddress: {
      type: String
    },
    location: pointSchema,
    rating: Number,
    types: [String],
    raw: Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

/**
 * Represents a Google Place result persisted in MongoDB.
 * The schema stores both structured fields and the raw payload for future flexibility.
 */
const Place = models.Place || model("Place", placeSchema);

module.exports = Place;
