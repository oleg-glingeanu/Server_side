import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: String,
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    picturePath: {
      type: String,
      default: "",
    },
    userPicturePath: {
      type: String,
      required: true,
    },
    description: String,
    price: Number,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;