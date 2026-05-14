import User from "../../models/user.model.js"


const logOutController = async (req,res) => {
    try{

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


        const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

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