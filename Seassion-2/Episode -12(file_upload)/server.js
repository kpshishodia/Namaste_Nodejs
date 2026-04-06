require("dotenv").config();
const ConnectToDB = require("./src/DB/Database")
const express = require("express")
const server = express()
const port = process.env.PORT
const User = require("./src/models/user")

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