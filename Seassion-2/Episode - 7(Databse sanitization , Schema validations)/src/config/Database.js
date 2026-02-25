
require("dotenv").config();
const mongoose = require("mongoose")
const url = process.env.MONGO_URL

const ConnectToDB = async () =>{
    await mongoose.connect(url)
};


module.exports = ConnectToDB