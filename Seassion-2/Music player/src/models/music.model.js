// ----------------------------------------------------
// music.model.js — Music schema
// ----------------------------------------------------
// Collection: ytmusic
// Plugin: mongoose-aggregate-paginate-v2 for future list/pagination APIs
// ----------------------------------------------------

import  mongoose from "mongoose";

// Plugin used for pagination with aggregation queries
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const { Schema } = mongoose;

// -----------------------------
// Music  Schema Definition
// -----------------------------
const musicSchema = new Schema(
  {
    // 🎥 Stores video file URL (Cloudinary / S3 / local path)
    musicFile: {
      type: String,
      required: true, // must be provided
    },

    // 🖼 Thumbnail image URL for preview
    thumbnail: {
      type: String,
      required: true,
    },

    // 📝 Title of the music
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

    // 👤 Reference to the user who uploaded the music
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User", // links this field to User collection
      required: true,
    },

    // 👀 Number of views on the music
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
// 🔌 Apply Pagination Plugin
// -----------------------------
// Adds aggregatePaginate() method (aggregatePaginate) to the schema
musicSchema.plugin(mongooseAggregatePaginate);

// -----------------------------
// 🧠 Create Model
// -----------------------------
const Music = mongoose.model(
  "Music", // Model name (used in code)
  musicSchema,
  "ytmusic" // Collection name in MongoDB
);

// -----------------------------
// 📦 Export Model
// -----------------------------
export default Music;