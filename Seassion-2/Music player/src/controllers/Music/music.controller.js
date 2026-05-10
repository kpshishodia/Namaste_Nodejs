import Music from "../../models/music.model.js";
import uploadOnCloudinary from "../../services/cloudinaryService.js";

// Basic test flow: one Multer file (`musicFile`) → Cloudinary → save.
// Model still needs `thumbnail`; use a placeholder until you add a second upload.
const PLACEHOLDER_THUMBNAIL =
  "https://placehold.co/400x400/1a1a1a/fff?text=Music";

const createMusic = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({
        message: "Send one file as form-data field: musicFile",
      });
    }

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

    const uploaded = await uploadOnCloudinary(req.file.path);
    if (!uploaded?.url) {
      return res.status(500).json({ message: "Upload failed" });
    }

    const music = await Music.create({
      musicFile: uploaded.url,
      thumbnail: PLACEHOLDER_THUMBNAIL,
      title: String(title).trim(),
      duration: durationNum,
      artist: req.user._id,
    });

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
