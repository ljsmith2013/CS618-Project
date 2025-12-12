import express from "express";
import { postsRoutes } from "./routes/posts.js";
import { userRoutes } from "./routes/users.js";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io"
import { handleSocket } from "./socket.js";
import { createServer } from "node:http";

const app = express();

app.use(bodyParser.json());
app.use(cors());

postsRoutes(app);
userRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

handleSocket(io);

export { server as app };
