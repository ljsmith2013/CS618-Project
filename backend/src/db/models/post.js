import mongoose, { Schema } from "mongoose";
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    contents: String,
    ingredients: [String],
    imageUrl: String,
    likedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    tags: [String],
  },
  { timestamps: true },
);
export const Post = mongoose.model("post", postSchema);
