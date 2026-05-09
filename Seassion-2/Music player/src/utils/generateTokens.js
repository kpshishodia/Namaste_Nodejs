import User from "../models/user.model.js";

// Central helper used by auth controllers to avoid duplicate token logic.
// It generates tokens and persists the latest refresh token for the user.
const generateAccessAndRefreshTokens = async (userId) => {

  try {

    // Fetch fresh user document before calling schema methods.
    const user = await User.findById(userId);

    // Schema methods return signed JWT strings.
    const accessToken =
      await user.generateAccessToken();

    const refreshToken =
      await user.generateRefreshToken();

    // Keep only the latest refresh token in DB.
    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };

  } catch (error) {

    throw new Error(
      "Something went wrong while generating tokens"
    );
  }
};

export default generateAccessAndRefreshTokens;