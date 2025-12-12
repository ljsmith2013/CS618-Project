import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Blog } from "./pages/Blog.jsx";
import { Signup } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import { ViewRecipe } from "./pages/ViewPost.jsx";

import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "./socket.js";

const queryClient = new QueryClient();

function RootLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const onNewRecipe = (payload) => {
      const title = payload?.title ? `"${payload.title}"` : "a new recipe";
      const open = window.confirm(`New recipe added: ${title}\n\nOpen it?`);

      if (open && payload?.id) {
        navigate(`/recipes/${payload.id}`);
      }
    };
    socket.on("recipe.new", onNewRecipe);
    return () => socket.off("recipe.new", onNewRecipe);
  }, [navigate]);
  return <Outlet />;
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Blog /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "recipes/:id", element: <ViewRecipe /> },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
