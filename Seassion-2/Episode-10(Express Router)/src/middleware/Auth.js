// const User = require("../models/user")
// const jwt = require("jsonwebtoken")

// const UserAuth =  async (req,res,next) => {
// // Read the Token from the request Cookies
// try{
// // const token = req.cookies?.token;
// const {token} = req.cookies;

// if(!token){
//     throw new Error("Token is not valid.")
// }
// console.log(token)

// // Validate the Token
//  const decodedobj = await jwt.verify(
//       token,
//        "Sample@746"
//     );

// //Find the User

//     const {_id}  = decodedobj;

//     const user = await User.findById(_id);
//     if(!user){
//         throw new Error("User not found")
//     }

//     req.user = user

//     next();



// }catch(error){
// res.status(400).send("ERROR : " + error.message);
// }




// }


// module.exports = {
// UserAuth
// }





const User = require("../models/user");
const jwt = require("jsonwebtoken");

const UserAuth = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Unauthorized: Token missing");
    }

    // 2️⃣ Verify token
    const decodedObj = jwt.verify(token, "Sample@746");

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

