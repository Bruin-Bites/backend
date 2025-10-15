import express from "express";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import { mapsRouter } from "./googlemaps/mapsRouter";

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Backend");
});

app.use("/maps", mapsRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});