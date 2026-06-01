import User from "../../models/user.model.js";

const updatePasswordController = async (req, res) => {
  try {
    // ----------------------------------------------------
    // 1. Get password fields from request body
    // ----------------------------------------------------
    // oldPassword      -> current password entered by user
    // newPassword      -> new password user wants to set
    // confirmPassword  -> confirmation of new password
    // ----------------------------------------------------

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // ----------------------------------------------------
    // 2. Basic validation
    // ----------------------------------------------------
    // Make sure all required fields are provided.
    // ----------------------------------------------------

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // ----------------------------------------------------
    // 3. Get authenticated user from database
    // ----------------------------------------------------
    // verifyJWT middleware has already verified the user
    // and attached user information to req.user.
    //
    // We use req.user._id to find the latest user document
    // from the database.
    // ----------------------------------------------------

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ----------------------------------------------------
    // 4. Verify current password
    // ----------------------------------------------------
    // Compare the old password entered by the user
    // with the hashed password stored in the database.
    //
    // isPasswordCorrect() is a custom schema method.
    // ----------------------------------------------------

    const isMatch = await user.isPasswordCorrect(oldPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    // ----------------------------------------------------
    // 5. Check if new password and confirm password match
    // ----------------------------------------------------

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password must match.",
      });
    }

    // ----------------------------------------------------
    // 6. Prevent user from reusing same password
    // ----------------------------------------------------

    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from old password.",
      });
    }

    // ----------------------------------------------------
    // 7. Update password
    // ----------------------------------------------------
    // Assign the new password.
    //
    // The pre("save") middleware in the User model
    // will automatically hash the password before saving.
    // ----------------------------------------------------

    user.password = newPassword;

    // ----------------------------------------------------
    // 8. Save updated user document
    // ----------------------------------------------------

    await user.save({validateBeforeSave : false});

    // ----------------------------------------------------
    // 9. Send success response
    // ----------------------------------------------------

    return res.status(200).json({
      message: "Password updated successfully.",
    });

  } catch (error) {
    // ----------------------------------------------------
    // Error handling
    // ----------------------------------------------------
    // Catch any unexpected errors and return a
    // consistent response structure.
    // ----------------------------------------------------

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default updatePasswordController;