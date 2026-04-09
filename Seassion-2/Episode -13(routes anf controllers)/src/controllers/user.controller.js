// const registerUserController = async (req, res) => {
//   try {
//     return res.status(201).json({
//       message: "okk",
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: "Bad request",
//       error: error.message,
//     });
//   }
// };

// module.exports = registerUserController ;


const registerUserController = async (req, res) => {
  try {
   
    // steps to register user 

// 1 . get user deatil from fronend (postman)
// 2 . validations -- not empty -- require fields user can only send data which pass validation such as isEmail , isStrongPassword , etc.
// 3 . check if user already exist -- return user already exist response
// 4 . check for images , check for avatar
// 5 . upload them to cloudinary service
// 6 . extract url from cloudinay service response
// 7 . create user object == create entry in DB
// 8 . remove password and refresh token field from response
// 9 . check for user creation 
// 10 . return response

const {firstName,lastName,email,password} = req.body
console.log("email:" , email , "firstName:" , firstName)
res.status(201).send("success")

  } catch (error) {
    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
};

module.exports = registerUserController ;