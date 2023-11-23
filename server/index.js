const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { User } = require("./models/users");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/threads");
  console.log("database connected");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use("/api/user", userRouter.router);
app.use("/api/post", postRouter.router);

app.listen(8080, () => {
  console.log("server is started on port 8080");
});
