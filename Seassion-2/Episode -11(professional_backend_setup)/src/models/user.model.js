
const mongoose = require("mongoose");

// Used for validating email format
const validator = require("validator");

// JWT for authentication (access & refresh tokens)
const jwt = require("jsonwebtoken");

// bcrypt for hashing passwords securely
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

// -----------------------------
// 👤 User Schema Definition
// -----------------------------
const userSchema = new Schema(
  {
    // 🧑 First Name of user
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxlength: 20,
      lowercase: true, // converts to lowercase before saving
      trim: true, // removes extra spaces
    },

    // 🧑 Last Name of user
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    // ⚧ Gender field with custom validation
    gender: {
      type: String,
      required: true,
      validate(value) {
        // only allow specific values
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid.");
        }
      },
      lowercase: true,
    },

    // 📧 Email field (must be unique & valid)
    email: {
      type: String,
      required: true,
      unique: true, // no duplicate emails allowed
      lowercase: true,
      trim: true,
      validate(value) {
        // validate email format using validator package
        if (!validator.isEmail(value)) {
          throw new Error("invalid email.");
        }
      },
    },

    // 🔐 Password (will be hashed before saving)
    password: {
      type: String,
      required: true,
    },

    // 🎂 Age of user
    age: {
      type: Number,
      required: true,
    },

    // 📝 About section (bio)
    about: {
      type: String,
      default: "This is default message about section.",
    },

    // 🛠 Skills array (list of strings)
    skills: {
      type: [String],
    },

    // 🖼 Profile image URL (stored in cloud like Cloudinary)
    avatar: {
      type: String,
      required: true,
    },

    // 🖼 Cover image (optional)
    coverImage: {
      type: String,
    },

    // 🎥 Watch history (array of Video references)
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video", // connects to Video model
      },
    ],

    // 🔄 Refresh token (stored in DB for session management)
    refreshtoken: {
      type: String,
    },
  },
  {
    // 🕒 Automatically adds createdAt & updatedAt
    timestamps: true,
  }
);

// -----------------------------
// 🔐 Pre-save Hook (Password Hashing)
// -----------------------------
userSchema.pre("save", async function (next) {
  // Only hash password if it is modified
  if (!this.isModified("password")) return next();

  // Hash password with salt rounds = 10
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// -----------------------------
// 🔑 Method: Check Password
// -----------------------------
userSchema.methods.isPasswordCorrect = async function (password) {
  // Compare plain password with hashed password
  return await bcrypt.compare(password, this.password);
};

// -----------------------------
// 🔐 Method: Generate Access Token
// -----------------------------
userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key from .env
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // token expiry time
    }
  );
};

// -----------------------------
// 🔄 Method: Generate Refresh Token
// -----------------------------
userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
    },
    process.env.REFRESH_TOKEN_SECRET, // separate secret for refresh token
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// -----------------------------
// 🧠 Create Model
// -----------------------------
const User = mongoose.model(
  "User", // model name used in code
  userSchema,
  "Auth_cookies_JWT_tokkens" // collection name in MongoDB
);

// -----------------------------
// 📦 Export Model
// -----------------------------
module.exports = User;