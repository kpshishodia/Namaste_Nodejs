require("dotenv").config();
const ConnectToDB = require("./src/DB/Database")
const port = process.env.PORT
const app = require("./src/app")


// ================= DATABASE CONNECTION =================

// First connect to MongoDB
ConnectToDB()
    .then(() => {
        console.log("MongoDB Connected Successfully")

        // Start server only after DB connected
        app.listen(port, () => {
            console.log("Server running on port " + port)
        })
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error)
    })