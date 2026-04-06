const mongoose = require("mongoose");

const mongooseAgrregatePaginate = require("mongoose-aggregate-paginate-v2")

const { Schema } = mongoose;

// -----------------------------
// Video Schema
// -----------------------------
const videoSchema = new Schema(
  {
    // URL or path of video file
    videoFile: {
      type: String,
      required: true,
    },

    // Thumbnail image
    thumbnail: {
      type: String,
      required: true,
    },

    // Title of video
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Description of video
    description: {
      type: String,
      trim: true,
    },

    // Duration in seconds
    duration: {
      type: Number,
      required: true,
    },

    // Owner (User who uploaded video)
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },

    // Views count
    views: {
      type: Number,
      default: 0,
    },

    // Likes count
    likes: {
      type: Number,
      default: 0,
    },

    // Is video published or private
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);



// -----------------------------
// Model
// -----------------------------
const Video = mongoose.model(
  "Video",     // Model name
  videoSchema,
  "videos"     // Collection name (best practice: lowercase plural)
);


videoSchema.plugin(mongooseAgrregatePaginate)

module.exports = Video;