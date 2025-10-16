const { Router } = require("express");
const router = Router();

router.get("/", (_req, res) => {
  res.json({
    posts: [
      { id: "p1", text: "Diddy Riese for dessert—cash only!" },
      { id: "p2", text: "Kerckhoff coffee happy hour 2–4pm" }
    ]
  });
});

module.exports = router;
