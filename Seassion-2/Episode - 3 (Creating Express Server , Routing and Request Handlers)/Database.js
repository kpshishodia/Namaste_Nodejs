// Load environment variables from .env file
require("dotenv").config();

// Import MongoClient from mongodb package
const { MongoClient } = require("mongodb");

// Get MongoDB connection string from environment variables
const url = process.env.MONGO_URL;

// Create a new MongoDB client instance
const client = new MongoClient(url);

// Name of the database you want to use
const dbName = "NamasteNodejs";

// Main async function to handle database operations
async function main() {
  try {
    // 1️⃣ Establish connection to MongoDB cluster
    await client.connect();
    console.log("Database connected");

    // 2️⃣ Select the database
    const db = client.db(dbName);

    // 3️⃣ Select (or create if not exists) a collection
    const collection = db.collection("Episode_3_Express_server");

    // ------------------------
    // INSERT ONE DOCUMENT
    // ------------------------

    // Create a single user object
    const singleUser = {
      firstname: "Karan",
      lastname: "Shishodia",
      city: "Delhi",
      phoneNumber: "9876543210"
    };

    // Insert one document into the collection
    const oneResult = await collection.insertOne(singleUser);

    // insertedId gives the unique _id created by MongoDB
    console.log("insertOne ID:", oneResult.insertedId);


    // ------------------------
    // INSERT MULTIPLE DOCUMENTS
    // ------------------------

    // Create an array of user objects
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
      }
    ];

    // Insert multiple documents at once
    const manyResult = await collection.insertMany(manyUsers);

    // insertedCount shows how many documents were inserted
    console.log("insertMany count:", manyResult.insertedCount);


    // ------------------------
    // READ ALL DOCUMENTS
    // ------------------------

    // Find all documents in the collection
    const allUsers = await collection.find({}).toArray();

    console.log("All users:", allUsers);


    // ------------------------
    // COUNT DOCUMENTS
    // ------------------------

    // Count total number of documents in the collection
    const count = await collection.countDocuments();

    console.log("Total users:", count);

  } catch (error) {
    // If any error occurs, catch and log it
    console.error("Error:", error);

  } finally {
    // 4️⃣ Always close the database connection
    await client.close();
    console.log("Database connection closed");
  }
}

// Call the main function
main();