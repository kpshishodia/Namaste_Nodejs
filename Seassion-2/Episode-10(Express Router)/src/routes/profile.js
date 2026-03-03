


const express = require("express")
const profileRouter = express.Router()

// Import authentication middleware
const { UserAuth } = require("../middleware/Auth")

// ================= GET PROFILE =================

// This route is protected
profileRouter.get("/profile", UserAuth, async (req, res) => {
  try {

    // UserAuth middleware already attached user to req.user
    const user = req.user

    res.status(200).json({
      message: "Profile fetched successfully",
      user
    })

  } catch (error) {
    res.status(401).json({
      message: "Failed to fetch profile",
      error: error.message
    })
  }
})

module.exports = profileRouter