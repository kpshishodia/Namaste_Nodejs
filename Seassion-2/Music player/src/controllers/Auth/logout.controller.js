import User from "../../models/user.model.js"
import generateAccessAndRefreshTokens from "../../utils/generateTokens.js";

const logOutController = async (req,res) => {
    try{

    }catch(error){
        return res.status(500).json({
      message: error.message,
    });
    }
}

export default logOutController;