// ----------------------------------------------------
// LOGOUT USER CONTROLLER
// ----------------------------------------------------
// Flow / Pseudo Code:
//
// 1. Clear refresh token stored in database for logged-in user
// 2. Clear accessToken and refreshToken cookies from browser
// 3. Send success response
// ----------------------------------------------------

import User from "../../models/user.model.js"


const logOutController = async (req,res) => {
    try{

    // 1. Remove refresh token from user document (req.user set by verifyJWT)
     await  User.findByIdAndUpdate(
        req.user._id,
        {
          $set :{
            refreshToken : undefined
          }
        },
        {
          new : true
        }
      )

    // 2. Cookie options (must match login/register so clearCookie works)
        const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    // 3. Clear cookies and respond
    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json({
      message: "User Log Out successfully.",
    });

    }catch(error){
        return res.status(500).json({
      message: error.message,
    });
    }
}

export default logOutController;