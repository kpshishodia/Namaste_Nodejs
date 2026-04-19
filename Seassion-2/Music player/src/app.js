// Load environment variables from .env file into process.env
require("dotenv").config();

// Import required packages
const express = require("express");
const cookierParser = require("cookie-parser");
const cors = require("cors"); // Required for handling Cross-Origin requests
const userRouter = require("./routes/auth.route");

// Create an Express application
const app = express();

// ----------------------------
// Middleware Section
// ----------------------------

// Enable CORS (Cross-Origin Resource Sharing)
// This allows your backend to accept requests from a different frontend origin (like React app)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow requests only from this origin (defined in .env)
    credentials: true, // Allow cookies and authentication headers to be sent
  })
);

// Middleware to parse incoming JSON data
// Example: req.body will contain parsed JSON from frontend
app.use(express.json());

// Middleware to parse URL-encoded data (from forms)
// extended: true allows parsing nested objects
app.use(express.urlencoded({ extended: true }));

// Serve static files from "public" folder
// Example: images, CSS files, etc. can be accessed directly
app.use(express.static("public"));

// Middleware to parse cookies from incoming requests
// Cookies will be available in req.cookies
app.use(cookierParser());

// Mount user routes under /api/v1/users
// Example: POST /api/v1/users/register
app.use("/api/v1/users", userRouter);

// Export the app so it can be used in server.js or index.js
module.exports = app;