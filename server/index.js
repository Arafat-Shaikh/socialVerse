const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { User } = require("./models/users");
const userRouter = require("./routes/userRouter");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/threads");
  console.log("database connected");
}

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter.router);

app.listen(8080, () => {
  console.log("server is started on port 8080");
});
