require("dotenv").config();
const ConnectToDB = require("./DB/Database")
const userSchema = require("./models/user")
const express = require("express")
const server = express()
// Middleware → parses incoming JSON body
server.use(express.json()); 
const port = process.env.PORT

// ================= DATABASE CONNECTION =================

// First connect to MongoDB
ConnectToDB()
    .then(() => {
        console.log("MongoDB Connected Successfully")

        // Start server only after DB connected
        server.listen(port, () => {
            console.log("Server running on port " + port)
        })
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error)
    })