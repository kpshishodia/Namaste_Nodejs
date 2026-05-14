import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {

    // -----------------------------------------
    // Get access token from cookies
    // -----------------------------------------
    const accessToken = req.cookies.accessToken;

    // If token missing
    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    // -----------------------------------------
    // Verify token
    // -----------------------------------------
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // -----------------------------------------
    // Find user from DB
    // -----------------------------------------
    const user = await User.findById(decoded?._id)
      .select("-password -refreshToken");

    // If user not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    // -----------------------------------------
    // Attach user to request
    // -----------------------------------------
    req.user = user;

    // Continue to next middleware/controller
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default verifyJWT;