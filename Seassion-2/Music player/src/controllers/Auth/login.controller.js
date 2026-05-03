import User from "../../models/user.model.js"


// ----------------------
// LOGIN USER
// ----------------------
const loginUserController = async (req, res) => {
  try {
    // 1. get data from frontend
    const { email, password } = req.body;
    console.log("login:" , email , password)

    // 2. validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    // 3. check user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log("login : " , user)



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

    // 6. save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // ------------------------------------------------
    // 7. Cookie options
    // ------------------------------------------------

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    // 8. send cookies and response
 
    return res.status(200)
    .cookie("accessToken", accessToken, options)

      .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default loginUserController;