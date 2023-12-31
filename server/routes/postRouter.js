const express = require("express");
const {
  createPost,
  getPost,
  deletePost,
  likeAndUnlikePost,
  replyToPost,
  getFollowedUsersPost,
  getUserPosts,
  getUserRepliedPosts,
  getUserForYouPosts,
} = require("../controllers/postController");
const { authRoute } = require("../services/service");
const router = express.Router();

router
  .post("/create", authRoute, createPost)
  .get("/get/:id", authRoute, getPost)
  .patch("/like/:id", authRoute, likeAndUnlikePost)
  .put("/reply/:id", authRoute, replyToPost)
  .delete("/delete/:id", authRoute, deletePost)
  .get("/users/posts", authRoute, getFollowedUsersPost)
  .get("/user/:id", authRoute, getUserPosts)
  .get("/replied/:id", authRoute, getUserRepliedPosts)
  .get("/filtered", authRoute, getUserForYouPosts);

exports.router = router;
