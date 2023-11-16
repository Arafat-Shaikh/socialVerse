const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    postedBy: { type: String },
    text: { type: String, maxLength: 500 },
    img: { type: String },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    replies: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true },
        userProfilePic: { type: String, default: "" },
        username: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const virtual = postSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
postSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Post = mongoose.model("Post", postSchema);
