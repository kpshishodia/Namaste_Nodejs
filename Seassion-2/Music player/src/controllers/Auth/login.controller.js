import User from "../../models/user.model.js"
import generateAccessAndRefreshTokens from "../../utils/generateTokens.js";



// ----------------------
// LOGIN USER
// ----------------------
// Flow:
// 1) Read credentials from request body
// 2) Validate required fields
// 3) Find user by email
// 4) Compare password using schema method
// 5) Generate JWT tokens
// 6) Save refresh token in DB
// 7) Send cookies + success response
const loginUserController = async (req, res) => {
  try {
    // Step 1: get data from frontend
    const { email, password } = req.body;
    console.log("login:" , email , password)

    // Step 2: basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    // Step 3: check user exists by normalized email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log("login : " , user)



    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Step 4: compare plain password with hashed password from DB
    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

     // ----------------------------------------------------
        // 6. Generate Tokens (via shared utility)
        // ----------------------------------------------------
    
        // Utility internally:
        // - fetches user
        // - generates access/refresh tokens through schema methods
        // - saves refresh token in DB
        const { accessToken, refreshToken } =
          await generateAccessAndRefreshTokens(user._id);
    
    // ------------------------------------------------
    // 7. Cookie options
    // ------------------------------------------------

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    // Step 8: send secure cookies + response payload
 
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