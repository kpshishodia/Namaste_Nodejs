

// const mongoose = require("mongoose")

// const connectDB = async () => {
//     try {
//         await mongoose.connect
//         ("mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/?appName=NamasteNode")
//         console.log("MongoDB Connected Successfully")
//     } catch (error) {
//         console.error("MongoDB Connection Failed:", error.message)
//     }
// }

// connectDB()

require("dotenv").config();
const mongoose = require("mongoose")
const url = process.env.MONGO_URL

const ConnectToDB = async () =>{
    await mongoose.connect(url)
};


module.exports = ConnectToDB