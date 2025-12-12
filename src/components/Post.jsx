import PropTypes from "prop-types";
import { User } from "./User.jsx";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext.jsx";
import { likePost, unlikePost } from "../api/posts.js";

export function Post({ _id, title, contents, ingredients, imageUrl, author: userId, likeCount, likedBy }) {

  const [token, currentUser] = useAuth();
  const queryClient = useQueryClient();

  const hasLiked =
    Array.isArray(likedBy) && currentUser?._id
      ? likedBy.includes(currentUser._id)
      : false;

  const likeMutation = useMutation({
    mutationFn: () => likePost(token, _id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(token, _id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  return (
    <article>
      <h3>
        <Link to = {`/recipes/${_id}`}>{title}</Link>
      </h3>
      {imageUrl && (
        <div>
          <img
            src = {imageUrl}
            alt = {title}
            style = {{ width: "100%", maxWidth: "400px", height: "250px", objectFit: "cover", display: "block"}}
          />
        </div>
      )}
      {Array.isArray(ingredients) && ingredients.length > 0 && (
        <section>
          <h4>Ingredients</h4>
          <ul>
            {ingredients.map((item, index) => (
              <li key = {index}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {contents && (
        <section>
          <h4>Instructions</h4>
          <p>{contents}</p>
        </section>
      )}
      {userId && (
        <em>
          <br />
          Written by <User id={userId} />
        </em>
      )}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <strong>{(likeCount ?? (Array.isArray(likedBy) ? likedBy.length : 0))} likes</strong>

        {token ? (
          hasLiked ? (
            <button
              type="button"
              onClick={() => unlikeMutation.mutate()}
              disabled={unlikeMutation.isPending}
            >
              {unlikeMutation.isPending ? "Unliking..." : "Unlike"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
            >
              {likeMutation.isPending ? "Liking..." : "Like"}
            </button>
          )
        ) : null}
      </div>
    </article>
  );
}
Post.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  imageUrl: PropTypes.string,
  author: PropTypes.string,
  likeCount: PropTypes.number,
  likedBy: PropTypes.arrayOf(PropTypes.string),
};
