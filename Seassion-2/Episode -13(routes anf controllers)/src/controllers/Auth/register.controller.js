
// // steps to register user 

// // 1 . get user deatil from fronend (postman)
// // 2 . validations -- not empty -- require fields user can only send data which pass validation such as isEmail , isStrongPassword , etc.
// // 3 . check if user already exist -- return user already exist response
// // 4 . check for images , check for avatar
// // 5 . upload them to cloudinary service
// // 6 . extract url from cloudinay service response
// // 7 . create user object == create entry in DB
// // 8 . remove password and refresh token field from response
// // 9 . check for user creation 
// // 10 . return response



const User = require("../../models/user.model.js");
const uploadOnCloudinary = require("../../services/cloudinaryService.js");
const ValidateSignUpdata = require("../../utils/Validation.js");

const registerUserController = async (req, res) => {
  try {
    // ============================================================
    // 1. Get user data from request body (sent by the client)
    // ============================================================

    const { firstName, lastName, gender, email, password, age } = req.body;

    // ============================================================
    // 2. Validate that only allowed fields are sent in the request
    // ============================================================

    const allowedFields = [
      "firstName",
      "lastName",
      "gender",
      "email",
      "password",
      "age",
    ];

    const requestFields = Object.keys(req.body);

    const isValidField = requestFields.every((field) =>
      allowedFields.includes(field)
    );

    if (!isValidField) {
      return res.status(400).json({
        message: "Invalid fields found in request body.",
      });
    }

    // ============================================================
    // 3. Perform custom validation (empty fields, email format, etc.)
    // ============================================================

    ValidateSignUpdata(req.body);

    // ============================================================
    // 4. Check whether a user with the same email already exists
    // ============================================================

    const isUserAlreadyExist = await User.findOne({
      email: email,
    });

    if (isUserAlreadyExist) {
      return res.status(400).json({
        message: "User already exists with this email.",
      });
    }

    console.log("Existing User :", isUserAlreadyExist);

    // ============================================================
    // 5. Get uploaded files from Multer (stored temporarily on disk)
    // ============================================================

    const allFiles = req.files;

    console.log("All Files :", allFiles);

    const uploadedAvatarLocalPath = req.files?.avatar?.[0]?.path;
    const uploadedCoverImageLocalPath =
      req.files?.coverImage?.[0]?.path;

    if (!uploadedAvatarLocalPath || !uploadedCoverImageLocalPath) {
      return res.status(400).json({
        message: "Avatar or Cover Image not found.",
      });
    }

    console.log("Avatar Local Path :", uploadedAvatarLocalPath);
    console.log("Cover Image Local Path :", uploadedCoverImageLocalPath);

    // ============================================================
    // 6. Upload images from local storage to Cloudinary
    // ============================================================

    const uploadedAvatarResult = await uploadOnCloudinary(
      uploadedAvatarLocalPath
    );

    const uploadedCoverImageResult = await uploadOnCloudinary(
      uploadedCoverImageLocalPath
    );

    if (!uploadedAvatarResult || !uploadedCoverImageResult) {
      return res.status(400).json({
        message: "Error uploading files to Cloudinary.",
      });
    }

    console.log("Uploaded Avatar :", uploadedAvatarResult);
    console.log("Uploaded Cover Image :", uploadedCoverImageResult);

    // ============================================================
    // 7. Create a new user in the database
    // User.create() triggers the userSchema pre("save") middleware,
    // where the password gets hashed before being stored.
    // ============================================================

    const user = await User.create({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      gender,
      email: email.toLowerCase().trim(),
      password,
      age,
      avatar: uploadedAvatarResult.secure_url,
      coverImage: uploadedCoverImageResult.secure_url,
     
    });
  
  

    if (!user) {
      return res.status(400).json({
        message: "Error creating user in database.",
      });
    }


    // 8 .  accesstoken and refresh tojken from user model methods 
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    console.log(`accessToken : ${accessToken}`)
    console.log(`refreshToken :${refreshToken}`)

    // 9 . cookieOptions 

    const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

    // 10 . save refreshtoken in DB

    user.refreshToken = refreshToken

    await user.save({
      validateBeforeSave: false

    });

    // ============================================================
    // 11 . Fetch the newly created user while excluding sensitive fields
    // ============================================================

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken "
    );

    if (!createdUser) {
      return res.status(400).json({
        message: "Error fetching created user.",
      });
    }

    console.log("Created User :", createdUser);

    // ============================================================
    // 12. Send success response back to the client with cookie
    // ============================================================

    return res.status(201)
    .cookie("refreshToken" , refreshToken , cookieOptions)
    .json({
      message: "User successfully registered.",
      createdUser,
    });
  } catch (error) {
    console.log("Register Controller Error :", error);

    return res.status(500).json({
      message: "Something went wrong while registering the user.",
      error: error.message,
    });
  }
};

module.exports = registerUserController;