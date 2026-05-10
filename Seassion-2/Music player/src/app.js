import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/auth.route.js";
import musicRouter from "./routes/music.routes.js";

const app = express();

// CORS config allows browser clients to send cookies cross-origin.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Request body and cookie parsers.
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Serve static assets if needed.
app.use(express.static("public"));

// Health check route.
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Music Player API is running",
  });
});

// API routes.
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/music", musicRouter);

export default app;
