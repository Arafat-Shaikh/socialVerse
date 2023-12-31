const { default: mongoose } = require("mongoose");
const { User } = require("../models/users");
const { generateTokenAndCookie } = require("../services/service");
const bcrypt = require("bcrypt");
const { Post } = require("../models/posts");
const { json } = require("express");
const cloudinary = require("cloudinary").v2;

exports.signupUser = async (req, res) => {
  try {
    const { email, password, username, name } = req.body;

    console.log(typeof password);
    const user = await User.findOne({ $or: [{ email }, { password }] });
    if (user) {
      return res.status(404).json({ error: "User already exist" });
    }

    if (password.length < 6) {
      return res
        .status(401)
        .json({ error: "password should greater than 6 digits" });
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

    res.status(201).json({
      name: doc.name,
      username: doc.username,
      email: doc.email,
      id: doc.id,
      bio: doc.bio,
      profilePic: doc.profilePic,
    });
  } catch (err) {
    console.log(err);
    if (err.code == 11000) {
      res.status(401).json({ error: "User already exist" });
    } else {
      res.status(401).json({ error: "Unexpected error" });
    }
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

      user.password = null;
      console.log(user);
      res.status(201).json(user);
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

exports.logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(201).json({ message: "User logged out successfully." });
  } catch (err) {
    console.log();
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    const { email, password, bio, name, username, profilePic } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        const imageId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      } else {
        const imageInfo = await cloudinary.uploader.upload(profilePic);
        user.profilePic = imageInfo.secure_url;
      }
    }

    const posts = await Post.find();

    posts.forEach(async (p) => {
      const post = await Post.findById(p.id);
      if (post.replies) {
        post.replies.forEach((r) => {
          if (r.userId.toString() === req.user.id) {
            r.username = username;
            if (profilePic) r.userProfilePic = user.profilePic;
          }
        });
      }

      await post.save();
    });

    user.name = name;
    user.username = username;
    user.email = email;
    user.bio = bio;

    await user.save();

    user.password = null;
    res.status(200).json(user);
  } catch (err) {
    console.log("update profile " + err);
    res.status(500).json({ error: err.message });
  }
};

exports.followAndUnFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(req.user.id);

    if (req.user.id === id) {
      return res.status(500).json({ error: "You could not follow yourself." });
    }

    if (userToFollow.followers.includes(currentUser.id)) {
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser.id },
      });
      await User.findByIdAndUpdate(currentUser.id, {
        $pull: { following: id },
      });
      res.status(201).json({ message: "Unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, {
        $push: { followers: currentUser.id },
      });
      await User.findByIdAndUpdate(currentUser.id, {
        $push: { following: id },
      });
      res.status(201).json({ message: "Followed successfully" });
    }
  } catch (err) {
    console.log("followAndUnfollow " + err.message);
    res.status(500).json({ error: "Unauthorized" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const identifier = req.params.id;
    console.log(identifier);
    console.log("this is identifier  " + typeof identifier);
    let query;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
      console.log("object id");
    } else {
      console.log("not object id");
      query = { username: identifier };
    }

    const user = await User.findOne(query)
      .select("-password")
      .select("-updatedAt");

    console.log("here is user  " + user);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.status(201).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    if (!req.user.id) {
      return res.status(500).json({ error: "user not found" });
    }

    const users = await User.find({});

    const suggestedUsers = users
      .filter((u) => !u.followers.includes(req.user.id))
      .filter((u) => u.id !== req.user.id);

    if (!suggestedUsers) {
      return res.status(200).json({ message: "no suggested users" });
    }

    res.status(201).json(suggestedUsers);
  } catch (err) {
    console.log("error in suggestedUsers " + err.message);
  }
};
