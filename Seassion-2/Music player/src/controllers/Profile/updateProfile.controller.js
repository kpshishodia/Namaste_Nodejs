import User from "../../models/user.model";


const updateProfileController = async (req , res) =>{

     try {
   

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