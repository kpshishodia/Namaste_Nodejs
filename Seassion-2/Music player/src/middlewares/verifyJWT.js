import jwt from "jsonwebtoken"


const verifyJWT = async (req,res,next) => {
    try {
        

        // ------------------------------------------------
    // Get access token from cookies.
    // This middleware currently validates only access token.
    // (Refresh token verification should happen in a dedicated refresh endpoint.)
    // ------------------------------------------------

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorize Acces you are forbidden!.",
            });
        }



        // ------------------------------------------------
    // Verify JWT signature + expiry using ACCESS_TOKEN_SECRET.
    // ------------------------------------------------

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // ------------------------------------------------
    // Store decoded claims on req.user for downstream middlewares/controllers.
    // ------------------------------------------------

    req.user = decoded;

    // Continue request lifecycle.
    next();
    } catch (error) {
         return res.status(400).json({
       message: "Invalid or expired token",
      error: error.message,
    });
    }
}

export default verifyJWT