

require("dotenv").config();
const { MongoClient } = require("mongodb");

// MongoDB connection URL
const url = process.env.MONGO_URL;
const client = new MongoClient(url);

// Database name
const dbName = "NamasteNodejs";

async function main() {
  try {
    // 1️⃣ Connect to MongoDB
    await client.connect();
    console.log("Database connected");

    const db = client.db(dbName);
    const users = db.collection("users");

    // ------------------------
    // INSERT ONE USER
    // ------------------------
    const singleUser = {
      firstname: "Karan",
      lastname: "Shishodia",
      city: "Delhi",
      phoneNumber: "9876543210"
    };

    const oneResult = await users.insertOne(singleUser);
    console.log("insertOne ID:", oneResult.insertedId);

    // ------------------------
    // INSERT MANY USERS
    // ------------------------
    const manyUsers = [
      {
        firstname: "Amit",
        lastname: "Sharma",
        city: "Mumbai",
        phoneNumber: "9999999999"
      },
      {
        firstname: "Neha",
        lastname: "Singh",
        city: "Jaipur",
        phoneNumber: "8888888888"
      },
      {
        firstname: "Demo",
        lastname: "Surname",
        city: "Delhi",
        phoneNumber: "6677887733" 
      },
      
    ];

    const manyResult = await users.insertMany(manyUsers);
    console.log("insertMany count:", manyResult.insertedCount);

    // ------------------------
    // READ ALL USERS
    // ------------------------
    const allUsers = await users.find({}).toArray();
    console.log("All users:", allUsers);

    // ------------------------
    // COUNT USERS
    // ------------------------
    const count = await users.countDocuments();
    console.log("Total users:", count);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    // 2️⃣ Close connection
    await client.close();
    console.log("Database connection closed");
  }
}

main();
