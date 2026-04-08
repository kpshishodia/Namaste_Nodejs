const mongoose = require("mongoose");

// Plugin used for pagination with aggregation queries
const mongooseAgrregatePaginate = require("mongoose-aggregate-paginate-v2");

const { Schema } = mongoose;

// -----------------------------
// 📹 Video Schema Definition
// -----------------------------
const videoSchema = new Schema(
  {
    // 🎥 Stores video file URL (Cloudinary / S3 / local path)
    videoFile: {
      type: String,
      required: true, // must be provided
    },

    // 🖼 Thumbnail image URL for preview
    thumbnail: {
      type: String,
      required: true,
    },

    // 📝 Title of the video
    title: {
      type: String,
      required: true,
      trim: true, // removes extra spaces from start & end
    },

    // 📄 Optional description of the video
    description: {
      type: String,
      trim: true,
    },

    // ⏱ Duration of the video in seconds
    duration: {
      type: Number,
      required: true,
    },

    // 👤 Reference to the user who uploaded the video
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // links this field to User collection
      required: true,
    },

    // 👀 Number of views on the video
    views: {
      type: Number,
      default: 0, // starts from 0
    },

    // ❤️ Number of likes on the video
    likes: {
      type: Number,
      default: 0,
    },

    // 🔒 Indicates if video is public or private
    isPublished: {
      type: Boolean,
      default: true, // true = public, false = private
    },
  },
  {
    // 🕒 Automatically adds:
    // createdAt → when document created
    // updatedAt → when document updated
    timestamps: true,
  }
);

// -----------------------------
// 🧠 Create Model
// -----------------------------
const Video = mongoose.model(
  "Video",     // Model name (used in code)
  videoSchema,
  "ytvideo"     // Collection name in MongoDB
);

// -----------------------------
// 🔌 Apply Pagination Plugin
// -----------------------------
// Adds aggregatePaginate() method to schema
videoSchema.plugin(mongooseAgrregatePaginate);

// -----------------------------
// 📦 Export Model
// -----------------------------
module.exports = Video;