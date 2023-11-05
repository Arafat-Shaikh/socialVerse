const jwt = require("jsonwebtoken");
const { User } = require("../models/users");
require("dotenv").config();

exports.generateTokenAndCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "10 days",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
};

exports.authRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in signup " + err.message);
    res.status(500).json({ message: err.message });
  }
};
