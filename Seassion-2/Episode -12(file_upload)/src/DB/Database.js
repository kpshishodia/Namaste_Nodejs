require("dotenv").config();

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME

const URL = (`${MONGO_URI}/${DB_NAME}`)

const ConnectToDB = async () => {
  try {
    console.log("Mongo URL:", URL); // debug

    await mongoose.connect(URL);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error.message);
    throw error ;
  }
};

module.exports = ConnectToDB;