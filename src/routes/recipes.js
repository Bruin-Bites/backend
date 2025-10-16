const { Router } = require("express");
const router = Router();

router.get("/", (_req, res) => {
  res.json({
    recipes: [
      { id: "r1", title: "TJ’s Cauliflower Gnocchi + Marinara" },
      { id: "r2", title: "$5 Ralphs Lentil Soup Hack" }
    ]
  });
});

module.exports = router;
