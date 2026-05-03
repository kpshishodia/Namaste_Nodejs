import Music from "../../models/music.model"


const createMusic = async (req , res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        const accessToken = req.cookies.accessToken

        if(!refreshToken || !accessToken){
            return res.status(401).json({
                message : "Unauthorize Acces you are forbidden!."
            })
        }
    } catch (error) {
        // ----------------------------------------------------
    // Error handling
    // ----------------------------------------------------

    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
    }
}

export default createMusic