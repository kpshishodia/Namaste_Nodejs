import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";

const refreshAccessToken = async (req, res) => {
    try {
        // 1. Get refresh token from cookie
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({
                message: "Refresh token is required.",
            });
        }

        console.log("incomingRefreshToken:", incomingRefreshToken);

        // 2. Verify refresh token
        const decodedRefreshToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        console.log("decodedRefreshToken:", decodedRefreshToken);

        // 3. Find user
        const user = await User.findById(decodedRefreshToken?._id);

        if (!user) {
            return res.status(401).json({
                message: "Invalid refresh token.",
            });
        }

        console.log("user:", user);

        // 4. Compare incoming refresh token with DB token
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                message: "Refresh token mismatch or expired.",
            });
        }

        // 5. Generate NEW tokens
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // 6. Save NEW refresh token in DB
        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false,
        });

        // 7. Cookie options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };

        // 8. Send NEW tokens as cookies
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "Access token refreshed successfully.",
            });

    } catch (error) {
        console.error("Refresh token error:", error);

        return res.status(401).json({
            message: "Invalid or expired refresh token.",
            error: error.message,
        });
    }
};

export default refreshAccessToken;