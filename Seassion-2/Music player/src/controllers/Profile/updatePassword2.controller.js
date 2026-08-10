import User from "../../models/user.model.js"

// 1 . fetch oldpaswword and confirm password from req.body
//2 .  / ----------------------------------------------------
    // verifyJWT middleware has already verified the user
    // and attached user information to req.user.
    //
    // We use req.user._id to find the latest user document
    // from the database.
// 3 . after getting user document from Db compare the oldpassword user sending in req with the passwrod stored in user document in DB with the help of bcrypt.compare (ispasswordCorrect method from userm model)
// 4 . after bcrypt.compare run save query it will hash the password (with the help of pre hook we defined in user model) save the current password in Db and return success response
const updatePasswordController = async (req,res) => {
try{
    // 1 . fetch oldpaswword and confirm password from req.body

    const { currentPassword, newPassword, confirmPassword } = req.body;

if (!currentPassword || !newPassword || !confirmPassword) {
  return res.status(400).json({
    message: "All password fields are required"
  });
}

if (newPassword.length < 8) {
  return res.status(400).json({
    message: "Password must be at least 8 characters"
  });
}

 // New password must be different from current password 
 if (newPassword === currentPassword) { 
    return res.status(400).json({
        message: "New password must be different from current password",
         });
 }

 // Confirm password
  if (newPassword !== confirmPassword) {
     return res.status(400).json({
         message: "Passwords do not match", 
        });
 }

// 2 .   ----------------------------------------------------
    // verifyJWT middleware has already verified the user
    // and attached user information to req.user.
    //
    // We use req.user._id to find the latest user document
    // from the database.

    const user = await User.findById(req?.user?._id)

    if(!user){
        return res.status(400).json({
            message: "Error finding user from DB.",
        })
    }
    console.log("user currentPassword:" , user.password)

    // 3 . after getting user document from Db compare the currentPassword user sending in req with the passwrod stored in user document in DB with the help of bcrypt.compare (ispasswordCorrect method from userm model)
const isMatch = await user.isPasswordCorrect(currentPassword)

if(!isMatch){
    return res.status(400).json({
        message: "invalid passowrd",
    })
}

// 4 . after bcrypt.compare run save query it will hash the password (with the help of pre hook we defined in user model) save the current password in Db and return success response

user.password = newPassword

 await user.save({validateBeforeSave : false});

 return res.status(200).json({
      message: "Password updated successfully.",
    });



}catch(error){
    return res.status(400).json({
        message: "Bad Request",
        error: error.message,
    })
}

}

export default updatePasswordController;