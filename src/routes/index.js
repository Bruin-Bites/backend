const { Router } = require("express");
const recipesRouter = require("./recipes");
const communityRouter = require("./community");
const dealsRouter = require("./deals");
const chatRouter = require("./chat");
const locationsRouter = require("./locations");

const router = Router();

router.get("/", (_req, res) => res.json({ message: "Bruin Bites API v1" }));
router.use("/recipes", recipesRouter);
router.use("/community", communityRouter);
router.use("/deals", dealsRouter);
router.use("/chat", chatRouter);
router.use("/locations", locationsRouter);

module.exports = router;
