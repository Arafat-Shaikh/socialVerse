const { User } = require("../models/users");
const { generateTokenAndCookie } = require("../services/service");
const bcrypt = require("bcrypt");

exports.signupUser = async (req, res) => {
  try {
    const { email, password, username, name } = req.body;
    console.log(typeof password);
    const user = await User.findOne({ $or: [{ email }, { password }] });
    if (user) {
      return res.status(401).json({ error: "User already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
    });
    const doc = await newUser.save();

    generateTokenAndCookie(doc.id, res);

    const filterDoc = doc.toObject();
    delete filterDoc.password;

    res.status(201).json(filterDoc);
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isUser = await bcrypt.compare(password, user.password);

    if (isUser) {
      generateTokenAndCookie(user.id, res);

      const doc = user.toObject();
      delete doc.password;
      res.status(201).json(doc);
    } else {
      res.status(401).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(401).json({ error: err });
  }
};

exports.checkUser = async (req, res) => {
  if (req.user) {
    res.status(201).send("ok");
  } else {
    res.status(401).json({ error: "not" });
  }
};
