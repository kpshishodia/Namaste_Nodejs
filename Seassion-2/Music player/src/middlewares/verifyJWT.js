import jwt from "jsonwebtoken"


const verifyJWT = async (req,res,next) => {
    try {
        

        // ------------------------------------------------
    // Get access token from cookies (refresh token is only for /refresh)
    // ------------------------------------------------

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorize Acces you are forbidden!.",
            });
        }



        // ------------------------------------------------
    // Verify token
    // ------------------------------------------------

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // ------------------------------------------------
    // Store decoded user data in request
    // ------------------------------------------------

    req.user = decoded;

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