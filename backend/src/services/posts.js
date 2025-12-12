import { Post } from "../db/models/post.js";
import { User } from "../db/models/user.js";
import mongoose from "mongoose";

export async function createPost(userId, { title, contents, tags, ingredients, imageUrl }) {
  const post = new Post({ title, author: userId, contents, tags, ingredients, imageUrl });
  return await post.save();
}

async function listPosts(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder });
}

export async function listAllPosts(options = {}) {
  const { sortBy = "createdAt", sortOrder = "descending" } = options;
  const order = sortOrder === "ascending" ? 1 : -1;
  if (sortBy === "popularity") {
    return await Post.aggregate([
      { $match: {} },
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$likedBy", []] } },
        },
      },
      { $sort: { likeCount: order, createdAt: -1 } },
    ]);
  }
  return await Post.find({}).sort({ [sortBy]: order });
}

export async function listPostsByAuthor(author, options = {}) {
  const { sortBy = "createdAt", sortOrder = "descending" } = options;
  const order = sortOrder === "ascending" ? 1 : -1;

  // author may be a username OR an ObjectId string
  let authorId = null;

  if (mongoose.Types.ObjectId.isValid(author)) {
    authorId = new mongoose.Types.ObjectId(author);
  } else {
    const user = await User.findOne({ username: author });
    if (!user) return []; // no such author -> no posts (not a 500)
    authorId = user._id;
  }

  if (sortBy === "popularity") {
    return await Post.aggregate([
      { $match: { author: authorId } },
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$likedBy", []] } },
        },
      },
      { $sort: { likeCount: order, createdAt: -1 } },
    ]);
  }

  return await Post.find({ author: authorId }).sort({ [sortBy]: order });
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options);
}

export async function getPostById(postId) {
  return await Post.findById(postId);
}

export async function updatePost(userId, postId, { title, contents, tags, ingredients, imageUrl }) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, contents, tags, ingredients, imageUrl } },
    { new: true },
  );
}
export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId });
}

export async function likePost(userId, postId) {
  return await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likedBy: userId } },
    { new: true },
  );
}

export async function unlikePost(userId, postId) {
  return await Post.findByIdAndUpdate(
    postId,
    { $pull: { likedBy: userId } },
    { new: true }, 
  );
}

export async function listTopPosts(limit = 20) {
  const lim = Number(limit);
  const safeLimit = Number.isFinite(lim) && lim > 0 ? Math.min(lim, 100) : 20;

  return await Post.aggregate([
    {
      $addFields: {
        likecount: { $size: { $ifNull: ["$likedBy", []]}},
      },
    },
    { $sort: { likecount: -1, createdAt: -1 } },
    { $limit: safeLimit },
  ]);
}