

const express = require("express")
const authRouter = express.Router()

// Used to hash and compare passwords
const bcrypt = require("bcrypt")

// JWT library (used to create token)
const jwt = require("jsonwebtoken")

// User MongoDB model
const User = require("../models/user")

// ================= SIGNUP =================

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Hash password before saving
    const passwordHash = await bcrypt.hash(password, 10)

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash
    })

    // Save to database
    await user.save()

    res.status(201).send("User registered successfully")

  } catch (error) {
    res.status(400).json({
      message: "Signup failed",
      error: error.message
    })
  }
})

// ================= LOGIN =================

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      throw new Error("User not found")
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }

    // ================= CREATE JWT TOKEN =================

    const token = jwt.sign(
      { _id: user._id },           // Payload
      process.env.JWT_SECRET,      // Secret key
      { expiresIn: "1d" }          // Token expiry
    )

    // ================= STORE TOKEN IN COOKIE =================

    res.cookie("token", token, {
      httpOnly: true,   // Prevent JS access (security)
      secure: false,    // Set true in production (HTTPS)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send("Login successful")

  } catch (error) {
    res.status(400).json({
      message: "Login failed",
      error: error.message
    })
  }
})

module.exports = authRouter