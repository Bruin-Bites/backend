const { Router } = require("express");
const Post = require("../models/post"); // Import your new post to create structure for the DB
const router = Router();

router.get("/", async (_req, res) => {
  try {
    // .find() gets all documents in mongo
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ posts: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Server error while fetching posts" });
  }
});

//this is what creates the post in community.
router.post("/", async (req, res) => {
  try {
    const { text, tag, author } = req.body;

    if (!text || !tag) {
      return res.status(400).json({ error: "Text and tag are required fields" });
    }

    // cxreate a new Post document using the model
    const newPost = new Post({
      text: text,
      tag: tag,
      author: author || "Anonymous Bruin",
      votes: 0,
    });

    // save the new document to the database
    const savedPost = await newPost.save();

    // send the saved post back to the frontend
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Server error while creating post" });
  }
});

module.exports = router;
