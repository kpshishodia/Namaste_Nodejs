import User from "../../models/user.model";

const updatePaswwordController = async(req,res) => {
    try{
       
        // 1 . get cretdetials from user/client from body

        const {oldPassword , newPassword , confirmPassword} = req.body

        if(!oldPassword|| newPassword || confirmPassword){
            return res.status(400).json({
                messgae : "All fields require.",
                error : error.message
            })
        }

        // 2. find user by _id i ma getting user from req bcs of veriJWT middleware

        const user = User.findById(req.user._id)

        if(!user){
            return res.status(400).json({
                message: "Bad request" ,
                error: error.message
            })
        }

    }catch(error){
        return res.status(400).json({
            message: "Bad request",
            error : error.message
        })
    }
}



export default updatePaswwordController