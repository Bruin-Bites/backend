const { Router } = require("express");
const router = Router();

router.get("/", (_req, res) => {
  res.json({
    deals: [
      { id: "d1", name: "Mock: $4 bowl near campus", expires: "2025-12-31" }
    ]
  });
});

module.exports = router;
