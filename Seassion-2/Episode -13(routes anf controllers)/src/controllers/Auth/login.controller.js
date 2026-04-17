const User = require("../../models/user.model")

// ----------------------
// LOGIN USER
// ----------------------
const loginUserController = async (req, res) => {
  try {
    // 1. get data from frontend
    const { email, password } = req.body;

    // 2. validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    // 3. check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 4. compare password
    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // 5. generate tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // save refresh token in DB
    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 6. send response
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = loginUserController;