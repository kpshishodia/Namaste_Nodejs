import User from "../../models/user.model.js"


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
    // Register uses multipart/form-data: Multer runs first (see user.route.js), then this handler runs.
    // 1. Get user details from frontend (Postman / client request)
    const { userName, email, password } = req.body;

    // Debugging (to check incoming data)
    console.log("email:", email, "userName:", userName);

    // ----------------------------------------------------
    // 2. Allowed fields validation
    // Only allow specific fields from user
    // This prevents users from sending unwanted data like "role", "isAdmin", etc.
    // ----------------------------------------------------

    const allowedFields = ["userName", "email", "password"];

    // Extract keys (field names) from request body
    // (With multipart, only text parts appear in req.body; file parts are in req.files.)
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
    if (!userName || userName.trim().length < 4) {
      return res
        .status(400)
        .send("userName should be at least 4 characters long");
    }

    // 3 . check if user already exist
    // $or: finds a document if either condition matches (email or same plaintext password — unusual; often only email is checked)

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


// 6 . create user object == create entry in DB
// User.create triggers userSchema pre("save"): password is hashed before persist; plain password is not stored.

const user = await User.create({
  userName: userName.toLowerCase(),
  email,
  password
})

console.log("user :" , user)

// 7 . remove password and refresh token field from response
// .select("-password -refreshtoken") omits those fields from the JSON-safe document.

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
    // Catches thrown Errors, validation errors, and failed awaits; sends message to client.
    // ----------------------------------------------------
    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
};

export default registerUserController;