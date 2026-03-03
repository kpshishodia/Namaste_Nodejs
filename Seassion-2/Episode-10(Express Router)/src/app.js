

// ================= IMPORT SECTION =================

// Load environment variables early (so all modules can access process.env)
require("dotenv").config()

// Import express framework
const express = require("express")
const cookieParser = require("cookie-parser")

// Port number where server will run
const port = 7001

// Create express app
const server = express()

// Import MongoDB connection function
const ConnectToDB = require("./config/Database")

// ================= GLOBAL MIDDLEWARES =================
// Parses JSON request bodies (needed for POST/PUT/PATCH with JSON payloads)
server.use(express.json())

// Populates req.cookies (needed by auth middleware that reads JWT from cookies)
server.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const connectionrequestRouter = require("./routes/connectionRequest")

// ================= ROUTES =================
// Mount routers.
// Since routers already contain full paths (e.g. "/login", "/profile"),
// we mount them without a prefix here.
server.use(authRouter)
server.use(profileRouter)
server.use(connectionrequestRouter)

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