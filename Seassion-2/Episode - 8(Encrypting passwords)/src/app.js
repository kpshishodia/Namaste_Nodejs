// Importing required modules
const express = require("express")           // Express framework for building APIs
const port = 6000                            // Server will run on port 6000
const server = express()                     // Creating express server instance
const ConnectToDB = require("./config/Database")  // Database connection file
const User = require("./models/user")        // User model schema
// const {ValidateSignUpdata} = require("./utils/Validation")
const ValidateSignUpdata = require("./utils/Validation")  // Custom validation logic
const bcrypt = require("bcrypt")             // Library to hash passwords

// Middleware to parse JSON body from client requests
server.use(express.json()); 



// creating new instance of user model

// ------------------------------------------------------------
// Custom Middleware
// ------------------------------------------------------------

// middleware - middleware to verify if user is 18+ will able to add data to database via post if not it will show error
const verifyage = (req,res,next)=>{
    const {age} = req.body;

    // Check if age field is provided
    if(!age){
        return res.status(400).send("Age is required.")
    }
    
    // Allow only users who are 18+
    if(age >= 18){
        next() // Move to next middleware / route handler (saving to database)
    }else{
        res.status(400).send("User must be 18+.")
    }
}



// ------------------------------------------------------------
// SIGNUP API
// ------------------------------------------------------------

// signup API - to add data from postman to database
server.post("/signup", verifyage, async (req, res) => {
    try {

        // Validate incoming signup data using custom validation function
        ValidateSignUpdata(req)

        // Destructuring required fields from request body
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


        // Encrypt (hash) the password before saving into database
        const passwordHash = await bcrypt.hash(password , 10);
        console.log(passwordHash)

        
        // Creating new user instance with hashed password
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



// ------------------------------------------------------------
// LOGIN API
// ------------------------------------------------------------

server.post("/Login" , async (req,res) => {
  try{

    const {email , password} = req.body;

    // Find user by email
    const user = await User.findOne({email : email});
    if(!user){
      throw new Error("Email mismatch user is not present in DB.")
    }

    // Compare entered password with hashed password in database
    const ispasswordValid = await bcrypt.compare(password , user.password)

    if(ispasswordValid){
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



// ------------------------------------------------------------
// GET USER BY EMAIL (find method)
// ------------------------------------------------------------

// get user by email
server.get("/user", async (req,res)=>{
     const {userEmail} = req.body
try{
    // Find all users with this email (returns array)
    const userdata = await User.find({email : userEmail})
    res.send(userdata)

}catch(error){
res.status(400).send("Invalid Email.")
}
})



// ------------------------------------------------------------
// GET ONE USER (findOne method)
// ------------------------------------------------------------

server.get("/oneuser", async (req, res) => {

    const {userEmail} = req.body;

    try {

        if (!userEmail) {
            return res.status(400).send("Email is required");
        }

        // Find single user document
        const userEmaildata = await User.findOne({ email: userEmail });

        if (!userEmaildata) {
            return res.status(404).send("User not found");
        }

        res.send(userEmaildata);

    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});



// ------------------------------------------------------------
// FEED API (Get all users)
// ------------------------------------------------------------

server.get("/feed",  async (req,res) =>{
try{
const usersfeed = await User.find();  // Fetch all users

if(usersfeed.length === 0){
   return  res.send("Feed is Empty.")
}
res.send(usersfeed)
}catch(error){
res.status(400).send("Something wrong in feed.")
}
})



// ------------------------------------------------------------
// GET USER BY ID
// ------------------------------------------------------------

server.get("/userid", async (req, res) => {

    const {UserId} = req.body
    try {
         // Find user using MongoDB ObjectId
         const user = await User.findById({_id : UserId})
        // const user = await User.findById(UserId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);
    } catch (error) {
        res.status(400).send("Invalid User ID");
    }
});



// ------------------------------------------------------------
// DELETE USER API
// ------------------------------------------------------------

server.get("/deleteuser", async(req,res)=>{
    const {UserId} = req.body
    try{
        // Delete user by ID
        const user = await User.findByIdAndDelete(UserId);
        res.send("Successfully Deleted User from Database.")

    }catch(error){
        res.status(400).send("Invalid User ID.")
    }
})



// ------------------------------------------------------------
// UPDATE USER BY ID (PATCH)
// ------------------------------------------------------------

server.patch("/UpdateUser", async (req, res) => {
  const { UserId, Data } = req.body;

  try {

    // Only allow these fields to be updated
    const Allowed_Updates = [ "lastName" , "about" , "skills"]

    // Check if all keys in Data are allowed
    const isAllowedUpdates = Object.keys(Data).every((key) => {
       return  Allowed_Updates.includes(key)
    })

    if(!isAllowedUpdates){
      throw new Error("udates of that particular key value not allowed")
    }

    // Update user and return updated document
    const updatedUser = await User.findByIdAndUpdate(
      UserId,
      Data,
      {
        runValidators: true, // Apply schema validations
        new: true            // Return updated document
      }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      message: "User Updated Successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// ------------------------------------------------------------
// UPDATE USER BY EMAIL (BODY)
// ------------------------------------------------------------

server.patch("/UpdateUserByEmail", async (req, res) => {
  const { Email, Data } = req.body;

  try {

    const Allowed_Updates = [ "lastName" , "about" , "skills"]

    const isAllowedUpdates = Object.keys(Data).every((key) => {
      return Allowed_Updates.includes(key)
    })

    if(!isAllowedUpdates){
      throw new Error("udates of that particular key value not allowed")
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: Email },     // Filter object
      { $set: Data },       // Safely set updated fields
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User Updated Successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// ------------------------------------------------------------
// UPDATE USER BY EMAIL (PARAM)
// ------------------------------------------------------------

server.patch("/UpdateUserByEmailParam/:userEmail", async (req, res) => {
  const { Data } = req.body;
  const userEmail = req.params?.userEmail

  try {

    const Allowed_Updates = [ "lastName" , "about" , "skills"]

    const isAllowedUpdates = Object.keys(Data).every((key) => {
      return Allowed_Updates.includes(key)
    })

    if(!isAllowedUpdates){
      throw new Error("udates of that particular key value not allowed")
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },  
      { $set: Data },       
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User Updated Successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// ------------------------------------------------------------
// SIGNUP WITH VALIDATOR LIBRARY
// ------------------------------------------------------------

server.post("/signupValidator", verifyage, async (req, res) => {
    try {
        
        // Directly creating user from request body
        const user = new User(req.body)

        await user.save()

        res.status(201).send("User added successfully to the database.")
    } catch (error) {
        res.status(400).json({
            message: "Bad request",
            error: error.message
        })
    }
});



// ------------------------------------------------------------
// DATABASE CONNECTION & SERVER START
// ------------------------------------------------------------

// Connect to MongoDB first, then start server
ConnectToDB()
    .then(() => {
        console.log("MongoDB Connected Successfully")
        server.listen(port, () => {
            console.log("Server running on port " + port)
        })
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error)
    })