const express = require("express");
const {
  signupUser,
  loginUser,
  checkUser,
} = require("../controllers/userController");
const { authRoute } = require("../services/service");
const router = express.Router();

router
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .get("/check", authRoute, checkUser);

exports.router = router;
