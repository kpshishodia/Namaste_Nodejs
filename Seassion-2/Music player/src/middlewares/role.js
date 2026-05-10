const verifyArtist = (req, res, next) => {

  // req.user is attached by verifyJWT middleware from token payload.
  // Block access unless logged-in user has artist role.
  if (req.user.role !== "artist") {
    return res.status(403).json({
      message: "Only artists can access this route",
    });
  }

  next();
};

export default verifyArtist;