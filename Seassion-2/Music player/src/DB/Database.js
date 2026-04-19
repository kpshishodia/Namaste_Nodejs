require("dotenv").config();

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME

const URL = (`${MONGO_URI}/${DB_NAME}`)

const ConnectToDB = async () => {
  try {
    // Debug log to verify your URL (remove in production if you want)
    console.log("Mongo URL:", URL);

    await mongoose.connect(URL);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    // IMPORTANT:
    // Re-throw the error so the caller can stop the server from starting
    // when MongoDB connection fails.
    console.log("❌ MongoDB Connection Failed:", error.message);
    throw error;
  }
};

module.exports = ConnectToDB;