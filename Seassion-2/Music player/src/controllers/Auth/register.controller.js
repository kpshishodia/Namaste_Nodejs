import User from "../../models/user.model.js";

// ----------------------------------------------------
// REGISTER USER CONTROLLER
// ----------------------------------------------------

// Steps:
// 1. Get user data from frontend
// 2. Validate incoming fields
// 3. Check if user already exists
// 4. Create user in DB
// 5. Generate access & refresh tokens
// 6. Send response

const registerUserController = async (req, res) => {
  try {
    // ----------------------------------------------------
    // 1. Get data from frontend (Postman / client)
    // ----------------------------------------------------

    const { userName, email, password } = req.body;

    // Debugging
    console.log("email:", email, "userName:", userName);

    // ----------------------------------------------------
    // 2. Allowed fields validation
    // Prevent users from sending extra fields like:
    // role, isAdmin, etc.
    // ----------------------------------------------------

    const allowedFields = ["userName", "email", "password"];

    // Get all keys sent by frontend
    const requestFields = Object.keys(req.body);

    // Check if every field is allowed
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

    // Check username
    if (!userName || userName.trim().length < 4) {
      return res.status(400).json({
        message: "userName should be at least 4 characters long",
      });
    }

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Check password
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password should be at least 6 characters long",
      });
    }

    // ----------------------------------------------------
    // 4. Check if user already exists
    // ----------------------------------------------------

    // Only check email
    // Never check password because passwords are hashed in DB
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

    // pre("save") middleware in schema automatically:
    // hashes the password before saving
    const user = await User.create({
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

    console.log("Created user :", user);

    // ----------------------------------------------------
    // 6. Generate Tokens
    // ----------------------------------------------------

    // These methods come from schema methods
    // userSchema.methods.generateAccessToken
    // userSchema.methods.generateRefreshToken

    const accessToken = await user.generateAccessToken();

    const refreshToken = await user.generateRefreshToken();

    // Debugging
    console.log("Access Token :", accessToken);
    console.log("Refresh Token :", refreshToken);

    // ----------------------------------------------------
    // 7. Remove sensitive data from response
    // ----------------------------------------------------

    // Fetch fresh user without password
    const createdUser = await User.findById(user._id).select("-password");

    // ----------------------------------------------------
    // 8. Send success response
    // ----------------------------------------------------

    return res.status(201).json({
      message: "User successfully registered",
      user: createdUser,
      accessToken,
      refreshToken,
    });

  } catch (error) {

    // ----------------------------------------------------
    // Error handling
    // ----------------------------------------------------

    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
};

export default registerUserController;