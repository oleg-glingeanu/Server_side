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
    expired: {
      type: Boolean,
      default: false,
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
    shortDescription: String,
    price: Number,
    currentBid: {
      type: Number,
      default: 0,
    },
    currentBidUserName: {
      type: String,
      default: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    endTime:{
      type: Date,
      required: true,
    },
    comments: {
      type: Array,
      default: [],
    },
    categories:{
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;