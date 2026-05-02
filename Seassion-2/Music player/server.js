// Load environment variables from .env (PORT, DB config, etc.)
import dotenv from "dotenv";
dotenv.config();

// Function that connects to MongoDB
import ConnectToDB from "./src/DB/Database.js"

// Import the configured Express app (middlewares, routes, etc.)
import app from "./src/app.js"

// Prefer PORT from .env, but fall back to 8000 for local dev
const port = process.env.PORT || 8000;

// ================= DATABASE CONNECTION =================

// Connect to MongoDB first, then start the HTTP server
ConnectToDB()
  .then(() => {
    console.log("MongoDB Connected Successfully");

    // Start server only after DB is connected successfully
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error);
  });