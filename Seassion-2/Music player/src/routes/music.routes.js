// ============================================================
// src/routes/music.routes.js — music API routes
// ============================================================
// Mounted at: /api/v1/music (see src/app.js)
// ============================================================

import express from "express"
import verifyJWT from "../middlewares/verifyJWT.js";
import createMusic from "../controllers/Music/music.controller.js";
import verifyArtist from "../middlewares/role.js";
import fileUpload from "../middlewares/multer.js";

const musicRouter = express.Router()

// Music route map:
// POST /api/v1/music/create-music
// Middleware order matters:
// 1) verifyJWT    -> user must be authenticated
// 2) verifyArtist -> only artists can upload
// 3) multer       -> parse multipart file field: "musicFile"
// 4) controller   -> upload + persist music document
musicRouter.post(
  "/create-music",
  verifyJWT,
  verifyArtist,
  fileUpload.single("musicFile"),
  createMusic
);
export default musicRouter