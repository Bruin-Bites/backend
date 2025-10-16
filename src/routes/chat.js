const { Router } = require("express");
const router = Router();

/**
 * Very simple mock “LLM”:
 * - echoes ingredients
 * - returns a budget-friendly idea
 * Replace with a real model later.
 */
router.post("/recipes", (req, res) => {
  const { message = "", history = [] } = req.body || {};
  const lower = message.toLowerCase();

  // pull simple ingredients
  const found = [];
  ["rice", "pasta", "eggs", "beans", "tortilla", "spinach", "tomato", "cheese", "chicken", "tofu", "ramen"].forEach(i => {
    if (lower.includes(i)) found.push(i);
  });

  const idea =
    found.length > 0
      ? `Here’s a cheap idea using ${found.join(", ")}:
- 1-pan ${found.includes("eggs") ? "egg" : "savory"} fried rice (≈ $2/serving). 
Steps: sauté aromatics, add ${found.includes("rice") ? "cooked rice" : "any grain"}, toss in ${found.includes("egg") ? "scrambled eggs" : "protein"}, veggies, soy/salt/pepper. Optional: top with sriracha.
Swap-ins: frozen veggies, leftover chicken/tofu, or canned beans.`
      : `Give me 2–4 ingredients you have (e.g., “eggs, spinach, tortilla”). I’ll suggest a <$5 meal with steps.`;

  res.json({
    reply: idea,
    tips: [
      "Shop ALDI/Ralphs value brands for staples.",
      "Buy frozen veggies—cheaper and zero prep.",
      "Cook once, eat twice: make 2–3 servings."
    ],
    historyLen: history.length + 1
  });
});

module.exports = router;
