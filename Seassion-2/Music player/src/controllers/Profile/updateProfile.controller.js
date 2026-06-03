import User from "../../models/user.model";


const updateProfileController = async (req , res) =>{

     try {
   // 1. get email  , userName , about  fields user want to update from req.body

   const {userName , about , email} = req.body

  //  if(!email || !userName || !about){
  //   return res.status(400).json({
  //       message: "All fields are required",
  //       error : error.message
  //   })

    // 2. get user._id from verifyJWT middleware

    

   }

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

}

export default updateProfileController