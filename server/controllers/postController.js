const { Post } = require("../models/posts");
const { User } = require("../models/users");

exports.createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    if (!postedBy || !text) {
      return res
        .status(500)
        .json({ error: "text or postedBy could not empty." });
    }
    const user = await User.findById(postedBy);

    if (req.user.id !== user.id) {
      return res.status(500).json({ error: "you are not authorized to post" });
    }

    const newPost = new Post({ postedBy: postedBy, text: text });
    await newPost.save();

    res.status(201).json({ message: "post created successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in create post " + err.message);
  }
};

exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(401).json({ error: "Post not found" });
    }

    res.status(201).json(post);
  } catch (err) {
    console.log("Error in getPost " + err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(401).json({ error: "post not found" });
    }

    await Post.findByIdAndDelete(id);
    res.status(201).json({ message: "post deleted successfully" });
  } catch (err) {
    console.log("Error in deletePost " + err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.likeAndUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id) {
      return res
        .status(500)
        .json({ error: "you are not authorized to like or unlike post" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(401).json({ error: "post not found" });
    }

    if (post.likes.includes(req.user.id)) {
      await User.findByIdAndUpdate(id, { $pull: { likes: req.user.id } });
      res.status(201).json({ message: "user unFollowed successfully." });
    } else {
      await User.findByIdAndUpdate(id, { $push: { likes: req.user.id } });
      res.status(201).json({ message: "user followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const username = req.user.username;
    const userProfilePic = req.user.profilePic;
    const userId = req.user.id;

    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(401).json({ message: "Post not found" });
    } else {
      post.replies.push({
        userId: userId,
        text: text,
        username: username,
        userProfilePic: userProfilePic,
      });
      const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
      res.status(201).json({ message: "reply added successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFollowedUsersPost = async (req, res) => {
  try {
    console.log(req.user.following);
    const following = req.user.following;
    const posts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });
    console.log(posts);

    res.status(201).json(posts);
  } catch (err) {
    console.log("Error in getting followed users post " + err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const username = req.params.id;
    const user = await User.findOne({ username });

    console.log("username here " + username);
    console.log("user here " + user);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: { $in: user.id } }).sort({
      createdAt: -1,
    });
    console.log(posts);
    res.status(201).json(posts);
  } catch (err) {
    console.log("Error in getUserPost " + err.message);
    res.status(500).json({ error: err.message });
  }
};
