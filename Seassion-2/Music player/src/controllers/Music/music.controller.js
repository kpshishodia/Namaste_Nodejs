// ----------------------------------------------------
// CREATE MUSIC CONTROLLER
// ----------------------------------------------------
// Flow / Pseudo Code:
//
// 1. Validate musicFile from Multer (req.file.path)
// 2. Validate title and duration from request body
// 3. Upload local file to Cloudinary via cloudinaryService
// 4. Create Music document in MongoDB (thumbnail = placeholder for now)
// 5. Populate artist details and send success response
// ----------------------------------------------------
// Note: Model requires thumbnail; placeholder used until second upload is added.

import Music from "../../models/music.model.js";
import uploadOnCloudinary from "../../services/cloudinaryService.js";

const PLACEHOLDER_THUMBNAIL =
  "https://placehold.co/400x400/1a1a1a/fff?text=Music";

const createMusic = async (req, res) => {
  try {
    // 1. Multer must provide a file on field name "musicFile"
    if (!req.file?.path) {
      return res.status(400).json({
        message: "Send one file as form-data field: musicFile",
      });
    }

    // 2. Read and validate text fields from multipart body
    const { title, duration } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const durationNum = Number(duration);
    if (!Number.isFinite(durationNum) || durationNum <= 0) {
      return res.status(400).json({
        message: "duration is required (seconds, positive number)",
      });
    }

    // 3. Upload temp file to Cloudinary; service deletes local copy after upload
    const uploaded = await uploadOnCloudinary(req.file.path);
    if (!uploaded?.url) {
      return res.status(500).json({ message: "Upload failed" });
    }

    // 4. Persist music metadata; artist = logged-in user from verifyJWT (req.user)
    const music = await Music.create({
      musicFile: uploaded.url,
      thumbnail: PLACEHOLDER_THUMBNAIL,
      title: String(title).trim(),
      duration: durationNum,
      artist: req.user._id,
    });

    // 5. Return document with artist userName, email, role
    const created = await Music.findById(music._id).populate(
      "artist",
      "userName email role"
    );

    return res.status(201).json({
      message: "Uploaded",
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save music",
      error: error.message,
    });
  }
};

export default createMusic;
