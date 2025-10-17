const dotenv = require("dotenv");

// Load environment variables from the .env file once at startup.
dotenv.config();

const config = {
  port: Number.parseInt(process.env.PORT, 10) || 5050,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "",
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
};

/**
 * Ensures that required environment variables are present before the server bootstraps.
 * Throws an error if any critical configuration values are missing so deployment fails fast.
 */
function assertConfiguration() {
  const missingKeys = Object.entries({
    MONGODB_URI: config.mongoUri,
    GOOGLE_MAPS_API_KEY: config.googleMapsApiKey
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
  }
}

module.exports = {
  ...config,
  assertConfiguration
};
