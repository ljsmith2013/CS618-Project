import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from "../services/posts.js";

import { requireAuth } from "../middleware/jwt.js";

export function postsRoutes(app) {

  const withLikeCount = (p) => {
    const obj = p?.toObject ? p.toObject() : p;
    return {
      ...obj,
      likecount: Array.isArray(obj?.likedby) ? obj.likedby.length : 0,
    };
  };
  app.get("/api/v1/posts", async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query;
    const options = { sortBy, sortOrder };
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: "query by either author or tag, not both" });
      } else if (author) {
        const posts = await listPostsByAuthor(author, options);
        return res.json(posts.map(withLikeCount));
      } else if (tag) {
        const posts = await listPostsByTag(tag, options);
        return res.json(posts.map(withLikeCount));
      } else {
        const posts = await listAllPosts(options);
        return res.json(posts.map(withLikeCount));
      }
    } catch (err) {
      console.error("error listing posts", err);
      return res.status(500).end();
    }
  });
  app.get("/api/v1/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const post = await getPostById(id);
      if (post === null) return res.status(404).end();
      return res.json(withLikeCount(post));
    } catch (err) {
      console.error("error getting post", err);
      return res.status(500).end();
    }
  });
  app.post("/api/v1/posts", requireAuth, async (req, res) => {
  try {
    const post = await createPost(req.auth.sub, req.body);
    const io = req.app.get("io");
    if (io) {
      io.emit("recipe.new", {
        id: post?._id?.toString?.() ?? post?._id,
        title: post?.title,
      });
    }
    return res.json(post);
  } catch (err) {
    console.error("error creating post", err);
    return res.status(500).end();
  }
});
  app.post("/api/v1/posts/:postId/like", requireAuth, async (req, res) => {
    const { postId } = req.params;
    const userId = req.auth.sub;

    const updated = await likePost(userId, postId);
    if (!updated) return res.status(404).json({ message: "post not found" });

    res.json(withLikeCount(updated));
  });
  app.patch("/api/v1/posts/:id", requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.auth.sub, req.params.id, req.body);
      return res.json(post);
    } catch (err) {
      console.error("error updating post", err);
      return res.status(500).end();
    }
  });
  app.delete("/api/v1/posts/:id", requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id);
      if (deletedCount === 0) return res.sendStatus(404);
      return res.status(204).end();
    } catch (err) {
      console.error("error deleting post", err);
      return res.status(500).end();
    }
  });
  app.delete("/api/v1/posts/:postId/like", requireAuth, async (req, res) => {
    const { postId } = req.params;
    const userId = req.auth.sub;

    const updated = await unlikePost(userId, postId);
    if (!updated) return res.status(404).json({ message: "post not found"});

    res.json(withLikeCount(updated));
  });
}
