const { Router } = require("express");
const { Post } = require("../models");
const router = Router();

router.get("/", (_req, res) => {
  Post.find().then(posts => res.json(posts));
});

router.post("/", async (req, res) => {
  const { username, content } = req.body;
  const post = new Post({ username, content });
  await post.save();
  res.json(post);
});

module.exports = router;
