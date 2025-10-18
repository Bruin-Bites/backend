const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const apiRouter = require("./routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "bruin-bites-backend",
    env: process.env.NODE_ENV,
  });
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`✅ API listening on http://localhost:${port}`);
});
