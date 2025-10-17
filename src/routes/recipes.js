const { Router } = require("express");
const { Recipe } = require("../models");
const router = Router();

router.get("/", async (_req, res) => {
  try {
    const recipes = await Recipe.find().populate('user', 'username');
    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content, ingredients, user } = req.body;
    const recipe = new Recipe({ title, content, ingredients, user });
    await recipe.save();
    await recipe.populate('user', 'username');
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

module.exports = router;
