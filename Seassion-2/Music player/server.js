// Load environment variables from .env (PORT, DB config, etc.)
require("dotenv").config();

// Function that connects to MongoDB
const ConnectToDB = require("./src/DB/Database");

// Import the configured Express app (middlewares, routes, etc.)
const app = require("./src/app");

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