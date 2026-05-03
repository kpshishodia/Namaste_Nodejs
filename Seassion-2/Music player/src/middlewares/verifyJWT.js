import jwt from "jsonwebtoken"


const verifyJWT = async (req,res,next) => {
    try {
        

        // ------------------------------------------------
    // Get access token from cookies
    // ------------------------------------------------

 const refreshToken = req.cookies.refreshToken
 const accessToken = req.cookies.accessToken

        if(!refreshToken || !accessToken){
            return res.status(401).json({
                message : "Unauthorize Acces you are forbidden!."
            })
        }  



        // ------------------------------------------------
    // Verify token
    // ------------------------------------------------

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );


     // ------------------------------------------------
    // Store decoded user data in request
    // ------------------------------------------------

    req.user = decodedToken;

    // Continue to next middleware/controller
    next();
    } catch (error) {
         return res.status(400).json({
       message: "Invalid or expired token",
      error: error.message,
    });
    }
}

export default verifyJWT