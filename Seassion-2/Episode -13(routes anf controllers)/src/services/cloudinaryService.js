require("dotenv").config(); 
// 📦 Loads environment variables from .env file into process.env

// Import cloudinary using CommonJS syntax
const cloudinary = require("cloudinary").v2;

// File system module (used to delete local files after upload)
const fs = require("fs");

// -----------------------------
// ☁️ Cloudinary Configuration
// -----------------------------
// Setting up cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // your cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // API secret
});

// -----------------------------
// 📤 Upload Function
// -----------------------------
// This function uploads a file from local storage to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // ❌ If file path is not provided, exit early
    if (!localFilePath) return;

    // 📤 Upload file to Cloudinary
    // Returns an object containing URL, public_id, etc.
    const uploadResult = await cloudinary.uploader.upload(localFilePath , {
        resource_type: "auto"
    });

    // 🧾 Log upload response (for debugging)
    console.log("uploadResult:", uploadResult);

    // 🗑️ Delete file from local storage after successful upload
    // This prevents unnecessary storage usage on server
    fs.unlinkSync(localFilePath);

    // ✅ Return upload result (important for controller usage)
    return uploadResult;

  } catch (error) {
    // ❌ If any error occurs during upload
    console.log(error);

    // 🗑️ Cleanup: delete file even if upload fails
    if (localFilePath) {
      fs.unlinkSync(localFilePath);
    }

    // ❌ Return null to indicate failure
    return null;
  }
};

// -----------------------------
// 📦 Export Function
// -----------------------------
// Makes this function usable in other files (like controllers)
module.exports = { uploadOnCloudinary };