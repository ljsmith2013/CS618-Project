export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  );
  return await res.json();
};

export const createPost = async (token, post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });
  return await res.json();
};

export const getPostById = async (postId) => {
  const res = await fetch (`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`);
  if (!res.ok) throw new Error("failed to fetch recipe");
  return await res.json();
};

export const getTopPosts = async (limit = 20) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/top?limit=${limit}`, 
  );
  if (!res.ok) throw new Error("failed to fetch top posts");
  return await res.json();
};

export const likePost = async (token, postId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) throw new Error("failed to like recipe");
  return await res.json();
};

export const unlikePost = async (token, postId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/like`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) throw new Error("failed to unlike recipe");
  return await res.json();
};
