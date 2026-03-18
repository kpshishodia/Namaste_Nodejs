// Load env from `src/.env` (works regardless of where node is executed from)
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })
const mongoose = require("mongoose")
const url = process.env.MONGO_URL

const ConnectToDB = async () =>{
    await mongoose.connect(url)
};


module.exports = ConnectToDB