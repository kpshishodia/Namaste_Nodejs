


const User = require("../models/user");
const jwt = require("jsonwebtoken");

const UserAuth = async (req, res, next) => {
  try {
    // JWT secret must be configured (usually via .env)
    if (!process.env.JWT_SECRET) {
      return res.status(500).send("Server misconfigured: JWT_SECRET missing");
    }

    // 1️⃣ Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).send("Unauthorized: Token missing");
    }

    // 2️⃣ Verify token
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    // 3️⃣ Find user
    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).send("Unauthorized: User not found");
    }

    // 4️⃣ Attach user to request
    req.user = user;

    // 5️⃣ Continue to next route
    next();

  } catch (error) {
    res.status(401).send("Authentication Failed: " + error.message);
  }
};

module.exports = { UserAuth };

