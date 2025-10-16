import express, { Request, Response } from "express";
import axios from "axios";

export const mapsRouter = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const API_BASE = "https://maps.googleapis.com/maps/api/place/textsearch/json";
const QUERY = "restaurants in Westwood Los Angeles";

mapsRouter.get("/restaurants", async (req: Request, res: Response) => {
  let westwoodRestaurants: any[] = [];
  let nextPageToken: string | null = null;

  try {
    do {
      let url: string;

      if (nextPageToken) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        url = `${API_BASE}?pagetoken=${nextPageToken}&key=${GOOGLE_API_KEY}`;
      } else {
        url = `${API_BASE}?query=${encodeURIComponent(QUERY)}&key=${GOOGLE_API_KEY}`;
      }

      const { data } = await axios.get(url);

      console.log(JSON.stringify(data, null, 2));

      if (data.results && data.results.length > 0) {
        westwoodRestaurants.push(...data.results);
      }

      nextPageToken = data.next_page_token || null;
      console.log(
        `Fetched ${data.results?.length || 0} results, total so far: ${westwoodRestaurants.length}`
      );

    } while (nextPageToken);

    res.json({
      total: westwoodRestaurants.length,
      results: westwoodRestaurants,
    });
  } catch (err: any) {
    console.error("Error fetching restaurants:", err.message);
    res.status(500).json({ error: "Failed to fetch restaurant data" });
  }
});
