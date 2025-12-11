import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext.jsx";
import { createPost } from "../api/posts.js";

export function CreatePost() {
  const [title, setTitle] = useState("");

  const [contents, setContents] = useState("");

  const [ingredientsText, setIngredientsText] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const [token] = useAuth();

  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: () => createPost(token, { title, contents, ingredients: ingredientsText.split("\n").map((line) => line.trimEnd()).filter(Boolean), imageUrl: imageUrl || undefined, }),
    onSuccess: () => {queryClient.invalidateQueries(["posts"]);
    setTitle("");
    setContents("");
    setIngredientsText("");
    setImageUrl("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  if (!token) return <div>Please log in to create new posts.</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="create-title">Title: </label>
        <input
          type="text"
          name="create-title"
          id="create-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor="ingredients">
          Ingredients <small>(one per line)</small>
        </label>
        <br />
        <textarea
          id = "ingredients"
          rows = {5}
          value = {ingredientsText}
          onChange = {(e) => setIngredientsText(e.target.value)}
          />
      </div>
      <br />
      <div>
        <label htmlFor = "contents">
          Instructions
        </label>
        <br />
        <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor = "image-url">Image URL</label>
        <br/>
        <input
          id = "image-url"
          type = "url"
          placeholder = "https://example.com/food-image.jpg"
          value = {imageUrl}
          onChange = {(e) => setImageUrl(e.target.value)}
        />
      </div>
      <br />
      <br />
      <input
        type="submit"
        value={createPostMutation.isPending ? "Creating..." : "Create"}
        disabled={!title}
      />
      {createPostMutation.isSuccess ? (
        <>
          <br />
          Post created successfully!
        </>
      ) : null}
    </form>
  );
}
