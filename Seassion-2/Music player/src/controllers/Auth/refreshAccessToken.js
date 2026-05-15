import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import generateAccessAndRefreshTokens from "../../utils/generateTokens.js";

const refreshAccessToken = async (req, res) => {
  try {

    // ------------------------------------------------
    // Get refresh token
    // ------------------------------------------------
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    // ------------------------------------------------
    // Check token exists
    // ------------------------------------------------
    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Refresh token is missing",
      });
    }

    // ------------------------------------------------
    // Verify refresh token
    // ------------------------------------------------
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // ------------------------------------------------
    // Find user
    // ------------------------------------------------
    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // ------------------------------------------------
    // Match refresh token with DB
    // ------------------------------------------------
    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({
        message: "Refresh token expired or mismatch",
      });
    }

    // ------------------------------------------------
    // Generate new tokens
    // ------------------------------------------------
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // ------------------------------------------------
    // Cookie options
    // ------------------------------------------------
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    // ------------------------------------------------
    // Send response
    // ------------------------------------------------
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken : newRefreshToken,
      });

  } catch (error) {

    return res.status(401).json({
      message: error.message,
    });

  }
};

export default refreshAccessToken;