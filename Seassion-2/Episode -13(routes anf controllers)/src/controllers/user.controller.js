const User = require("../models/user.model")
const uploadOnCloudinary = require("../services/cloudinaryService.js")

// steps to register user 

// 1 . get user deatil from fronend (postman)
// 2 . validations -- not empty -- require fields user can only send data which pass validation such as isEmail , isStrongPassword , etc.
// 3 . check if user already exist -- return user already exist response
// 4 . check for images , check for avatar
// 5 . upload them to cloudinary service
// 6 . extract url from cloudinay service response
// 7 . create user object == create entry in DB
// 8 . remove password and refresh token field from response
// 9 . check for user creation 
// 10 . return response

const registerUserController = async (req, res) => {
  try {
    // 1. Get user details from frontend (Postman / client request)
    const { firstName, lastName, email, password } = req.body;

    // Debugging (to check incoming data)
    console.log("email:", email, "firstName:", firstName);

    // ----------------------------------------------------
    // 2. Allowed fields validation
    // Only allow specific fields from user
    // This prevents users from sending unwanted data like "role", "isAdmin", etc.
    // ----------------------------------------------------

    const allowedFields = ["firstName", "lastName", "email", "password"];

    // Extract keys (field names) from request body
    const requestFields = Object.keys(req.body);

    // Check if every field sent by user is allowed
    const isValid = requestFields.every((field) =>
      allowedFields.includes(field)
    );

    // If any extra field is found → reject request
    if (!isValid) {
      return res.status(400).send("Invalid fields in request");
    }

    // ----------------------------------------------------
    //  Field validation (firstName)
    // Check if firstName exists and has minimum length
    // ----------------------------------------------------

    // !firstName → handles undefined, null, empty string
    // trim() → removes extra spaces ("   ")
    if (!firstName || firstName.trim().length < 4) {
      return res
        .status(400)
        .send("firstName should be at least 4 characters long");
    }

    // 3 . check if user already exist

  const existedUser = await User.findOne({
  $or: [
    { email: email },
    { password: password }
  ]
});


console.log("existedUser : " , existedUser)
if (existedUser) {
  throw new Error("User already exists with given email or password");
}


// 4 . check for images , check for avatar

// getting files we gettion from multer fileUpload middleware

// Avatar
const uploadedFileAvatarLocalPath = req.files?.avatar[0]?.path

console.log("uploadedFileAvatarLocalPath : " , uploadedFileAvatarLocalPath)

// coverImage

const uploadedFileCoverImageLocalPath = req.files?.coverImage[0]?.path

console.log("uploadedFileCoverImageLocalPath : " , uploadedFileCoverImageLocalPath)

if(!uploadedFileAvatarLocalPath || !uploadedFileCoverImageLocalPath){
  throw new Error("Avatar and CoverImage required.")
}


// 5 . upload them to cloudinary service


// avatar

const uploadedFileAvatarLocalPathResult = await uploadOnCloudinary(uploadedFileAvatarLocalPath)

console.log("uploadedFileAvatarLocalPathResult : " , uploadedFileAvatarLocalPathResult)

// coverImage

const uploadedFileCoverImageLocalPathResult = await uploadOnCloudinary(uploadedFileCoverImageLocalPath)
console.log("uploadedFileCoverImageLocalPathResult : " , uploadedFileCoverImageLocalPathResult)

if(!uploadedFileCoverImageLocalPathResult || !uploadedFileAvatarLocalPathResult ){
  throw new Error("avatar file or coverimage file failed to upload on cloudinary.")
}


// 6 . create user object == create entry in DB

const user = await User.create({
  firstName: firstName.toLowerCase(),
  lastName: lastName.toLowerCase(),
  avatar: uploadedFileAvatarLocalPathResult.url,
  coverImage: uploadedFileCoverImageLocalPathResult.url,
  email,
  password
})

console.log("user :" , user)

// 7 . remove password and refresh token field from response

const createdUser = await User.findById(user._id).select(
  "-password -refreshtoken"
)

if(!createdUser){
  throw new Error("somethin went wrong server unable to register user in DB.")
}

   // 9 . return response

   return res.status(201).json({
    message: "User successfully registered. ",
    createdUser

   })

  } catch (error) {
    // ----------------------------------------------------
    //  Error handling
    // If anything unexpected goes wrong
    // ----------------------------------------------------
    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
};

module.exports = registerUserController;