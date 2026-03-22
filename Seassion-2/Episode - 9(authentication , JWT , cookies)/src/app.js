

// ================= IMPORT SECTION =================

// Import express framework
const express = require("express")

// Port number where server will run
const port = 7000

// Create express app
const server = express()

// Import MongoDB connection function
const ConnectToDB = require("./config/Database")

// Import User model (MongoDB schema)
const User = require("./models/user")

// const {ValidateSignUpdata} = require("./utils/Validation")

// Import validation function for signup
const ValidateSignUpdata = require("./utils/Validation")

// Import authentication middleware
const {UserAuth} = require("./middleware/Auth")

// Import bcrypt → used for hashing passwords
const bcrypt = require("bcrypt")

// Import cookie-parser → used to read cookies from browser
const cookieParser = require("cookie-parser")

// Middleware → parses incoming JSON body
server.use(express.json()); 

// Middleware → allows us to access req.cookies
server.use(cookieParser())

// Import JWT library → used for token generation & verification
const jwt = require("jsonwebtoken")



// ================= CUSTOM MIDDLEWARE =================

// middleware - middleware to verify if user is 18+
// Only users with age >= 18 can signup
const verifyage = (req,res,next)=>{

    // Destructure age from request body
    const {age} = req.body;

    // If age not provided → stop request
    if(!age){
        return res.status(400).send("Age is required.")
    }
    
    // If age >= 18 → continue to next middleware
    if(age >= 18){
        next() //saving to database
    }else{
        // If age < 18 → reject
        res.status(400).send("User must be 18+.")
    }
}



// ================= SIGNUP API =================

server.post("/signup", verifyage, async (req, res) => {
    try {

        // Validate signup data using custom function
        ValidateSignUpdata(req)

        // Destructure user data from request body
        const {
          firstName,
          lastName,
          gender,
          email,
          password ,
          age,
          about,
          skills
        } = req.body

        // Hash password using bcrypt
        // 10 → salt rounds (complexity level)
        const passwordHash = await bcrypt.hash(password , 10);

        console.log(passwordHash)

        // Create new user instance
        const user = new User({
          firstName,
          lastName,
          gender,
          email,
          password : passwordHash, // store hashed password
          age,
          about,
          skills
        })

        // Save user into MongoDB
        await user.save()

        res.status(201).send("User added successfully to the database.")

    } catch (error) {
        res.status(400).json({
            message: "Bad request",
            error: error.message
        })
    }
})



// ================= LOGIN API =================

server.post("/Login" , async (req,res) => {
  try{

    // Get email & password from body
    const {email , password} = req.body;

    // Check if user exists in DB
    const user = await User.findOne({email : email});

    if(!user){
      throw new Error("Email mismatch user is not present in DB.")
    }

    // Compare entered password with hashed password in DB
    const ispasswordValid = await bcrypt.compare(password , user.password)

    if(ispasswordValid){

      // ================= JWT CREATION =================

      // jwt.sign() creates a new JWT token

      // First parameter → PAYLOAD
      // {_id : user._id}
      // This means we are storing user id inside token

      // Second parameter → SECRET KEY
      // Used to digitally sign the token
      // Must be same during jwt.verify()

      const token = await jwt.sign({_id : user._id} , "Sample@746")

      // token is now a long encrypted string
      console.log(token)

      // ================= COOKIE CREATION =================

      // res.cookie(name, value)

      // "token" → cookie name
      // token → JWT string

      // Browser will store this cookie
      // Browser automatically sends it in future requests

      res.cookie("token" , token)

      res.send("Login successfully.")

    }else{
      throw new Error("Password is not correct , Login failed.")
    }
 
  }catch(error){
     res.status(400).json({
            message: "Bad request",
            error: error.message
        })
  }
})



// ================= OLD PROFILE API (Manual JWT) =================

// server.get("/profile", async (req, res) => {
//   try {

//     // req.cookies → provided by cookie-parser
//     // It reads cookies sent from browser
//     const cookies = req.cookies;   
//     console.log("cookies:", cookies);

//     // Extract token from cookies
//     const {token} = cookies;
//     console.log(token)

//     // jwt.verify(token, secret)
//     // Verifies token authenticity
//     // Decodes payload if valid

//     const decodedMsg = await jwt.verify(token , "Sample@746");
//     console.log(decodedMsg)

//    // Extract _id from decoded payload
//    const {_id} = decodedMsg;

//    console.log("Logged In user is :" + _id)

//    // Find user using id from token
//    const user = await User.findById(_id)

//    res.send(user)
    
//   } catch (error) {
//     res.status(400).json({
//       message: "Bad request",
//       error: error.message
//     });
//   }
// });



// ================= PROFILE API (Using Middleware) =================

server.get("/profile", UserAuth ,  async (req, res) => {
  try {

    // UserAuth middleware already:
    // 1. Reads cookie
    // 2. Verifies token
    // 3. Fetches user from DB
    // 4. Attaches user to req.user

    const user = req.user

    res.status(200).json({
      message: "Profile fetched successfully",
      user
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: error.message
    });
  }
});



// ================= SEND CONNECTION REQUEST =================

server.post("/SendConnectionRequest" ,  UserAuth , async (req,res) => {
  try{

    // req.user comes from UserAuth middleware
    const user = req.user;

    console.log("checking Sendrequest API")

    res.send( user.firstName + " " + "sending the connection request.")

  }catch(error){
    res.status(401).json({
            message: "Bad request",
            error: error.message
        })
  }
})



// ================= DATABASE CONNECTION =================

// First connect to MongoDB
ConnectToDB()
    .then(() => {
        console.log("MongoDB Connected Successfully")

        // Start server only after DB connected
        server.listen(port, () => {
            console.log("Server running on port " + port)
        })
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error)
    })