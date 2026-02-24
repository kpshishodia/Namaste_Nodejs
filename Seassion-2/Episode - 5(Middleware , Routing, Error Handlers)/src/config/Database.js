

require("dotenv").config();
// // const url = process.env.MONGO_URL;
const mongoose = require('mongoose')
const url = process.env.MONGO_URL;


 const ConnectToDB = async() =>{
    console.log("Mongo URL:", process.env.MONGO_URL);
    await mongoose.connect(url)
 }

module.exports = ConnectToDB

