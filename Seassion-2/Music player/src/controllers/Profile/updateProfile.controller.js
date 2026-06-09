import User from "../../models/user.model.js";

const updateProfileController = async (req, res) => {
  try {
    // ----------------------------------------------------
    // 1. Get fields user wants to update from request body
    // ----------------------------------------------------
    // User may send:
    // - only about
    // - only userName
    // - only email
    // - or any combination of them
    // ----------------------------------------------------

    const { userName, email, about } = req.body;

    // ----------------------------------------------------
    // 2. Make sure at least one field is provided
    // ----------------------------------------------------

    if (
      userName === undefined &&
      email === undefined &&
      about === undefined
    ) {
      return res.status(400).json({
        message: "Provide at least one field to update.",
      });
    }

    // ----------------------------------------------------
    // 3. Get authenticated user from database
    // ----------------------------------------------------
    // verifyJWT middleware has already verified user
    // and attached user information to req.user
    // ----------------------------------------------------

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ----------------------------------------------------
    // 4. Check if email is already used by another user
    // ----------------------------------------------------

    if (email) {
      const existingUser = await User.findOne({ email });

//       const emailBelongsToSomeoneElse =
//   existingUser &&
//   existingUser._id.toString() !== user._id.toString();

// if (emailBelongsToSomeoneElse) {
//   return res.status(400).json({
//     message: "Email already exists."
//   });
// }

if(existingUser &&
   existingUser._id.toString() !== user._id.toString() ){
    return res.status(400).json({
      message:"Email already exists."
    })
   }
    }

    // ----------------------------------------------------
    // 5. Check if username is already used by another user
    // ----------------------------------------------------

    if (userName) {
      const existingUser = await User.findOne({ userName });

      if (
        existingUser &&
        existingUser._id.toString() !== user._id.toString()
      ) {
        return res.status(400).json({
          message: "Username already taken.",
        });
      }
    }

    // ----------------------------------------------------
    // 6. Update only the fields that were provided
    // ----------------------------------------------------
    // If frontend sends only "about",
    // only "about" gets updated.
    // ----------------------------------------------------

    if (userName !== undefined) {
      user.userName = userName;
    }

    if (email !== undefined) {
      user.email = email;
    }

    if (about !== undefined) {
      user.about = about;
    }

    // ----------------------------------------------------
    // 7. Save updated user document
    // ----------------------------------------------------

    await user.save();

    // ----------------------------------------------------
    // 8. Return success response
    // ----------------------------------------------------

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });

  } catch (error) {
    // ----------------------------------------------------
    // Error handling
    // ----------------------------------------------------

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default updateProfileController;