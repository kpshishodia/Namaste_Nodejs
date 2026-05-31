// ============================================================
// src/app.js — Express application setup
// ============================================================
// Wires global middleware and mounts API routers:
//   /api/v1/auth  → auth.route.js
//   /api/v1/music → music.routes.js
// ============================================================

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/auth.route.js";
import musicRouter from "./routes/music.routes.js";

const app = express();

// CORS: allow frontend origin; credentials: true so cookies work cross-origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Parse JSON / urlencoded bodies and read cookies (needed for JWT auth)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Optional: serve files from /public (e.g. temp uploads folder)
app.use(express.static("public"));

// Health check — no auth required
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Music Player API is running",
  });
});

// API routes.
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/music", musicRouter);

export default app;
