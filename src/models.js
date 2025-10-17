const mongoose = require("mongoose");
const { Schema } = mongoose;

// Post Schema
const postSchema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

// Recipe Schema
const recipeSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = { User, Post, Recipe };
