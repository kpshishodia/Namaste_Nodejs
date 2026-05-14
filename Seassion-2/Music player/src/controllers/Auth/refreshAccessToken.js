const refreshAccessToken = async (req, res) => {
  try {

    // -----------------------------------------
    // Get refresh token from cookies or body
    // -----------------------------------------
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    // -----------------------------------------
    // Check if refresh token exists
    // -----------------------------------------
    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Incoming Refresh token is missing",
      });
    }

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

export default refreshAccessToken;