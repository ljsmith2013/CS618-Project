import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../api/posts.js";
import { Header } from "../components/Header.jsx";
import { Post } from "../components/Post.jsx";

export function ViewRecipe() {
  const { id } = useParams();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
  });

  if (isLoading) return <div>Loading recipe...</div>;
  if (isError || !post) return <div>Recipe not found.</div>;

  return (
    <>
      <Header />
      <br />
      <Link to="/">Back to main page</Link>
      <Post {...post} />
    </>
  );
}