

const express = require("express")
const port = 8000
const server = express()
const connectDB = require("./config/Database")
const User = require("./models/user")
// const {ValidateSignUpdata} = require("./utils/Validation")
const ValidateSignUpdata = require("./utils/Validation")

const {UserAuth} = require("./middleware/Auth")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
server.use(express.json()); 

server.use(cookieParser())

const jwt = require("jsonwebtoken")



// creating new instance of user model

// middleware - middleware to verify if user is 18+ will able to add data to database via post if not it will show error
const verifyage = (req,res,next)=>{
    const {age} = req.body;

    if(!age){
        return res.status(400).send("Age is required.")
    }
    
    if(age >= 18){
        next() //saving to database
    }else{
        res.status(400).send("User must be 18+.")
    }
}

// signup API - to add data fromm postoman to databse

server.post("/signup", verifyage, async (req, res) => {
    try {
        // const userobj = {
        //     firstName: "Sample3 name",
        //     lastName: "Sample3 lastname",
        //     password: "sample2@342",
        //     email: "sample2@321",
        //     gender: "Male",
        //     age: 23
        // }

        // const user = new User(userobj)

        // validate data
        ValidateSignUpdata(req)

        // encrypt password

        const {firstName,
          lastName,
          gender,
          email,
          password ,
          age,
          about,
          skills} = req.body


        const passwordHash = await bcrypt.hash(password , 10);
        console.log(passwordHash)


        
        // const user = new User(req.body)

        const user = new User({
          firstName,
          lastName,
          gender,
          email,
          password : passwordHash,
          age,
          about,
          skills
        })
        // console.log(req.body)

        // if (!user.email) {
        //     throw new Error("Email is required")
        // }

        await user.save()

        res.status(201).send("User added successfully to the database.")
    } catch (error) {
        res.status(400).json({
            message: "Bad request",
            error: error.message
        })
    }
})


// Login api

server.post("/Login" , async (req,res) => {
  try{

    const {email , password} = req.body;

    const user = await User.findOne({email : email});
    if(!user){
      throw new Error("Email mismatch user is not present in DB.")

    }
// validate password

    const ispasswordValid = await bcrypt.compare(password , user.password)

    if(ispasswordValid){

      // Create a JWT Token

      const token = await jwt.sign({_id : user._id} , "Sample@746")

      console.log(token)

      // Add the Token to cookie and send the response back  to the user


      // res.cookie("token", "jhhjgy5h8756tfggy");

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


// // Profile API 

// server.get("/profile", async (req, res) => {
//   try {
//     const cookies = req.cookies;   // ✅ correct
//     console.log("cookies:", cookies);

//     // validate the token

//     const {token} = cookies;
//     console.log(token)

//     const decodedMsg = await jwt.verify(token , "Sample@746");
//     console.log(decodedMsg)

//    const {_id} = decodedMsg;
//    console.log("Logged In user is :" + _id)

//    const user = await User.findById(_id)

//    res.send(user)
    

//     // res.send("Reading cookies");
//   } catch (error) {
//     res.status(400).json({
//       message: "Bad request",
//       error: error.message
//     });
//   }
// });

// Profile API 

server.get("/profile", UserAuth ,  async (req, res) => {
  try {
    const user = req.user

    // 4. Send profile
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


// connectionrequest API

server.post("/SendConnectionRequest" ,  UserAuth , async (req,res) => {
  try{

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

// DB connection 

connectDB()
    .then(() => {
        console.log("MongoDB Connected Successfully")
        server.listen(port, () => {
            console.log("Server running on port " + port)
        })
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error)
    })



