// ----------------------------------------------------
// verifyArtist middleware (role check)
// ----------------------------------------------------
// Flow / Pseudo Code:
// 1. req.user is set by verifyJWT on the same route
// 2. Allow next() only if req.user.role === "artist"
// 3. Otherwise return 403
// ----------------------------------------------------

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