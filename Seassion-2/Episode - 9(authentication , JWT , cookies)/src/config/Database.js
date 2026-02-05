

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


// const mongoose = require("mongoose")

// const connectDB = async () =>{
//     await mongoose.connect
//     ("mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/?appName=NamasteNode")
//     // ("mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/?appName=NamasteNode/devTinder")
// };


// module.exports = connectDB


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/test"
    );
    console.log("MongoDB connected (test DB)");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
