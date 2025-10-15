import express, { Request, Response } from "express";
import axios from "axios";

export const mapsRouter = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const DEFAULT_LOCATION = "34.0635,-118.4455"; // Westwood Village
const DEFAULT_RADIUS = 1500;


mapsRouter.get("/restaurants", async (req: Request, res: Response) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Westwood+Los+Angeles&key=${GOOGLE_API_KEY}`;
    const { data } = await axios.get(url);

    console.log(JSON.stringify(data, null, 2));
    res.json(data);
  } catch (err: any) {
    console.error("Error fetching restaurants:", err.message);
    res.status(500).json({ error: "Failed to fetch restaurant data" });
  }
});
