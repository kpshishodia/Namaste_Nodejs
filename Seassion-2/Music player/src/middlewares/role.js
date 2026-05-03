const verifyArtist = (req, res, next) => {

  // req.user comes from verifyJWT middleware
  if (req.user.role !== "artist") {
    return res.status(403).json({
      message: "Only artists can access this route",
    });
  }

  next();
};

export default verifyArtist;