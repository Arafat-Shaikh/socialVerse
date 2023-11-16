const express = require("express");
const {
  signupUser,
  loginUser,
  checkUser,
  logoutUser,
  updateProfile,
  followAndUnFollow,
  getUserProfile,
} = require("../controllers/userController");
const { authRoute } = require("../services/service");
const router = express.Router();

router
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .get("/check", authRoute, checkUser)
  .get("/profile/:id", authRoute, getUserProfile)
  .post("/logout", logoutUser)
  .patch("/update/", authRoute, updateProfile)
  .post("/follow/:id", authRoute, followAndUnFollow);

exports.router = router;
