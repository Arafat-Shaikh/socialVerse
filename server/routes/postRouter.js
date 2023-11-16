const express = require("express");
const {
  createPost,
  getPost,
  deletePost,
  likeAndUnlikePost,
  replyToPost,
  getFollowedUsersPost,
  getUserPosts,
} = require("../controllers/postController");
const { authRoute } = require("../services/service");
const router = express.Router();

router
  .post("/create", authRoute, createPost)
  .get("/get/:id", authRoute, getPost)
  .post("/like/:id", authRoute, likeAndUnlikePost)
  .post("/reply/:id", authRoute, replyToPost)
  .delete("/delete/:id", authRoute, deletePost)
  .get("/users/posts", authRoute, getFollowedUsersPost)
  .get("/user/:id", authRoute, getUserPosts);

exports.router = router;
