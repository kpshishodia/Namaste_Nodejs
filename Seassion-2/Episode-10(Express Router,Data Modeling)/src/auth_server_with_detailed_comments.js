// ===============================
// IMPORT REQUIRED PACKAGES
// ===============================

const express = require("express"); // Web framework for Node.js
const mongoose = require("mongoose"); // MongoDB ORM
const bcrypt = require("bcrypt"); // Password hashing library
const cookieParser = require("cookie-parser"); // To read cookies from request
const jwt = require("jsonwebtoken"); // For creating & verifying JWT tokens

// ===============================
// INITIALIZE EXPRESS SERVER
// ===============================

const port = 8000;
const server = express();

// Middleware to parse JSON body from requests
server.use(express.json());

// Middleware to read cookies from browser
server.use(cookieParser());

// ===============================
// DATABASE CONNECTION
// ===============================

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/?appName=NamasteNode"
  );
  console.log("✅ MongoDB connected successfully");
};

connectDB();

// ===============================
// USER SCHEMA & MODEL
// ===============================

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      lowercase: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      lowercase: true,

      // Custom validation for gender values
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid.");
        }
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    about: {
      type: String,
      default: "This is default message about section.",
    },

    skills: {
      type: [String],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

const User = mongoose.model("users_validation", userSchema);

// ===============================
// AGE VERIFICATION MIDDLEWARE
// ===============================

// This middleware checks if user age is >= 18 before allowing signup
const verifyAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    return res.status(400).send("Age is required.");
  }

  if (age >= 18) {
    next(); // Continue to next middleware or route
  } else {
    res.status(400).send("User must be 18+.");
  }
};

// ===============================
// SIGNUP API
// ===============================

server.post("/signup", verifyAge, async (req, res) => {
  try {
    // Destructure user data from request body
    const {
      firstName,
      lastName,
      gender,
      email,
      password,
      age,
      about,
      skills,
    } = req.body;

    // Hash the password before saving to DB
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user document
    const user = new User({
      firstName,
      lastName,
      gender,
      email,
      password: passwordHash,
      age,
      about,
      skills,
    });

    // Save user in MongoDB
    await user.save();

    res.status(201).send("✅ User added successfully to the database.");
  } catch (error) {
    res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
});

// ===============================
// LOGIN API
// ===============================

server.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email in DB
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email mismatch. User not found.");
    }

    // 2️⃣ Compare entered password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Incorrect password. Login failed.");
    }

    // 3️⃣ Create JWT token containing user ID
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "Sample@746",
      { expiresIn: "1d" } // Token valid for 1 day
    );

    // 4️⃣ Store JWT inside secure cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: false, // Set true in production (HTTPS only)
      sameSite: "strict", // Prevent CSRF attacks
    });

    res.send("✅ Login successful.");
  } catch (error) {
    res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
});

// ===============================
// PROFILE API (PROTECTED ROUTE)
// ===============================

server.get("/profile", async (req, res) => {
  try {
    // 1️⃣ Read token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    // 2️⃣ Verify JWT token
    const decodedMsg = jwt.verify(
      token,
      process.env.JWT_SECRET || "Sample@746"
    );

    const { _id } = decodedMsg;

    // 3️⃣ Fetch user from DB (exclude password)
    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 4️⃣ Send profile data
    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
});

// ===============================
// START SERVER
// ===============================

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
