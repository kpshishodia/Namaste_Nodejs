// require("dotenv").config();

// const { default: mongoose } = require("mongoose");

// const mongoose = require("mongoose");
// const MONGO_URI = process.env.MONGO_URI;
// const DB_NAME = process.env.DB_NAME

// const URL = (`${MONGO_URI}/${DB_NAME}`)

// const ConnectToDB = async () => {
//   try {
//     console.log("Mongo URL:", URL); // debug

//     await mongoose.connect(URL);

//     console.log("✅ MongoDB Connected");
//   } catch (error) {
//     console.log("❌ MongoDB Connection Failed:", error.message);
//   }
// };

// module.exports = ConnectToDB;


require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const URL = (`${MONGO_URI}/${DB_NAME}`)
const {mongoose} = require("mongoose")

const connectToDB = async () =>{
  try{
    console.log(`URL:${URL}`)
    await mongoose.connect(URL);
    console.log("✅ MongoDB Connected");
  }catch(error){
    res.status(400).json({
      message: "bad request",
      error: error.message,
    })

    console.log("❌ MongoDB Connection Failed:", error.message)
  }
}

module.exports = connectToDB;
