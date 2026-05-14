import User from "../../models/user.model.js";
import generateAccessAndRefreshTokens from "../../utils/generateTokens.js";



// ----------------------------------------------------
// REGISTER USER CONTROLLER
// ----------------------------------------------------

// Flow / Pseudo Code:
//
// 1. Get user data from frontend request
//
// 2. Validate allowed incoming fields
//    - prevent unwanted fields
//
// 3. Validate required fields & input data
//    - username
//    - email
//    - password
//    - role
//
// 4. Check if user already exists in database
//
// 5. Create user document in MongoDB
//    - password automatically hashed by schema middleware
//
// 6. Generate JWT access & refresh tokens
//    - using shared utility
//
// 7. Save refresh token in database
//
// 8. Remove sensitive fields from response
//
// 9. Configure cookie options
//
// 10. Send cookies + success response

// This controller handles end-to-end user registration.
// It validates input, creates the user, creates tokens, stores refresh token,
// and returns both cookies + sanitized user data.
const registerUserController = async  (req, res) => {
  try {
    // ----------------------------------------------------
    // 1. Get data from frontend (Postman / client)
    // ----------------------------------------------------

    // Destructure expected fields from request body for easy validation/use.
    const { userName, email, password , role} = req.body;

    // Debugging
    console.log("email:", email, "userName:", userName);

    // ----------------------------------------------------
    // 2. Allowed fields validation
    // Prevent users from sending extra fields like:
    // role, isAdmin, etc.
    // ----------------------------------------------------

    // Whitelist approach protects API from unexpected/malicious payload keys.
    const allowedFields = ["userName", "email", "password", "role"];

    // Get all keys sent by frontend to compare with whitelist.
    const requestFields = Object.keys(req.body);

    // Ensure each request key exists in allowed fields.
    const isValid = requestFields.every((field) => {
      return allowedFields.includes(field);
    });

    // Reject request if extra field exists
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid fields in request",
      });
    }

    // ----------------------------------------------------
    // 3. Basic validations
    // ----------------------------------------------------

    // Username must be present and reasonably long for readability/uniqueness.
    if (!userName || userName.trim().length < 4) {
      return res.status(400).json({
        message: "userName should be at least 4 characters long",
      });
    }


    // Email presence check (format validation can be added later if needed).
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Password minimum length check for basic security.
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password should be at least 6 characters long",
      });
    }
 
    // Role check ensures user type is explicitly provided.

    if(!role){
       return res.status(400).json({
        message: "Role is required",
      });
    }

    // ----------------------------------------------------
    // 4. Check if user already exists
    // ----------------------------------------------------

    // Check by email only (unique identity field for registration).
    // Password is never queried for existence because it is hashed in DB.
    const existedUser = await User.findOne({
      email: email.toLowerCase(),
    });

    console.log("existedUser :", existedUser);

    if (existedUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // ----------------------------------------------------
    // 5. Create user in database
    // ----------------------------------------------------

    // Schema pre("save") middleware automatically hashes the password.
    // Convert username/email to lowercase for normalized storage.
    const user = await User.create({
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role,
    });

    console.log("Created user :", user);

    // ----------------------------------------------------
    // 6. Generate Tokens (via shared utility)
    // ----------------------------------------------------

    // Utility internally:
    // - fetches user
    // - generates access/refresh tokens through schema methods
    // - saves refresh token in DB
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // Debugging
    console.log("Access Token :", accessToken);
    console.log("Refresh Token :", refreshToken);

    // ------------------------------------------------
    // 7. Save refresh token
    // ------------------------------------------------
    // Already handled inside generateAccessAndRefreshTokens utility.
    // ----------------------------------------------------
    // 8. Remove sensitive data from response
    // ----------------------------------------------------

    // Read user again and exclude password before sending response.
    const createdUser = await User.findById(user._id).select("-password");


    // ------------------------------------------------
    // 9. Cookie options
    // ------------------------------------------------

    // Cookie options:
    // - httpOnly blocks JS access (XSS protection)
    // - secure=false for local/dev HTTP (set true in production HTTPS)
    // - sameSite strict helps reduce CSRF risk
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };
    // ----------------------------------------------------
    // 10.  Send cookies and  success response
    // ----------------------------------------------------

    // Send tokens in cookies + useful response body for frontend.
    return res.status(201)
    .cookie("accessToken", accessToken, options)

      .cookie("refreshToken", refreshToken, options)

    .json({
      message: "User successfully registered",
      user: createdUser,
      accessToken,
      refreshToken
    });

  } catch (error) {

    // ----------------------------------------------------
    // Error handling: keeps response consistent for any unexpected failure.
    // ----------------------------------------------------

    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
};

export default registerUserController;