const { Post } = require("../models/posts");
const { User } = require("../models/users");
const cloudinary = require("cloudinary").v2;

exports.createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;
    let newPost;

    if (!postedBy || !text) {
      return res
        .status(500)
        .json({ error: "text or postedBy could not empty." });
    }
    const user = await User.findById(postedBy);

    if (req.user.id !== user.id) {
      return res.status(500).json({ error: "you are not authorized to post" });
    }

    if (img) {
      const imgInfo = await cloudinary.uploader.upload(img);
      img = imgInfo.secure_url;
      newPost = new Post({ postedBy: postedBy, text: text, img: img });
    } else {
      newPost = new Post({ postedBy: postedBy, text: text });
    }

    const doc = await newPost.save();

    res.status(201).json(doc);
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

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
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
    if (!req.user.id) {
      return res
        .status(500)
        .json({ error: "you are not authorized to like or unlike post" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(401).json({ error: "post not found" });
    }

    console.log(req.user.id);

    if (post.likes.includes(req.user.id)) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: req.user.id } });
      res.status(201).json({ message: "Post liked" });
    } else {
      await Post.findByIdAndUpdate(id, { $push: { likes: req.user.id } });
      res.status(201).json({ message: "Post unliked" });
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
      res.status(201).json(updatedPost);
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

exports.getUserRepliedPosts = async (req, res) => {
  try {
    const username = req.params.id;

    const posts = await Post.find({
      replies: {
        $elemMatch: { username: username },
      },
    });

    if (!posts) {
      return res.status(201).json({ message: "Not yet replied" });
    }

    console.log(posts);
    res.status(201).json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserForYouPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const posts = await Post.find().sort({ createdAt: -1 });

    if (!posts) {
      return res.status(201).json({ message: "Posts not found" });
    }

    const filteredPosts = posts.filter(
      (p) => !user.following.includes(p.postedBy)
    );

    const followedUsersPosts = posts.filter((p) =>
      user.following.includes(p.postedBy)
    );

    followedUsersPosts.map((p) => filteredPosts.push(p));

    res.status(201).json(filteredPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
