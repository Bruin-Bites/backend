const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const apiRouter = require("./routes");
const { connectToDatabase } = require("./lib/mongo");
const { port, nodeEnv, assertConfiguration } = require("./config");

assertConfiguration();

const app = express();

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

/**
 * Provides a quick way to check if the server is alive and which environment is running.
 */
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bruin-bites-backend", env: nodeEnv });
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

/**
 * Centralized error handler to ensure errors are formatted consistently for clients.
 */
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || "Internal server error" });
});

/**
 * Bootstraps the HTTP server after establishing a MongoDB connection.
 * Failing to connect should crash the process so the deployment can retry.
 */
async function start() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`✅ API listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();

module.exports = app;
