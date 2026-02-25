// Importing Express framework
const express = require("express")

// Defining port number
const port = 4000

// Creating Express server instance
const server = express()

// Importing database connection function
const connectDB = require("./config/Database")

// Importing User model (schema is defined in another file)
const User = require("./models/user")

// Middleware to parse incoming JSON requests
server.use(express.json()); 



// =======================================================
// CUSTOM MIDDLEWARES
// =======================================================

// Middleware - verifies user age before allowing signup
// If age < 18 → user cannot be added to database
const verifyage = (req,res,next)=>{
    const {age} = req.body;   // Extract age from request body

    // Check if age is provided
    if(!age){
        return res.status(400).send("Age is required.")
    }
    
    // Allow only if age is 18+
    if(age >= 18){
        next() // Move to next middleware / route handler
    }else{
        res.status(400).send("User must be 18+.")
    }
}


// Middleware - validates stream field
// Only allows science, commerce, arts
const choosestream = (req, res, next) => {
    const { stream } = req.body;  // Extract stream from request body

    // 1️⃣ Check if stream is provided
    if (!stream) {
        return res.status(400).json({
            message: "Stream is required"
        });
    }

    // 2️⃣ Allow only valid streams
    if (stream === "science") {
        console.log("Science stream selected");
        next();
    } 
    else if (stream === "commerce") {
        console.log("Commerce stream selected");
        next();
    } 
    else if (stream === "arts") {
        console.log("Arts stream selected");
        next();
    } 
    else {
        return res.status(400).json({
            message: "Invalid stream. Allowed streams are science, commerce, or arts."
        });
    }
};



// =======================================================
// SIGNUP API - Create New User
// =======================================================

// POST /signup
// This route adds user data from Postman into MongoDB
// verifyage and choosestream middlewares run before saving
server.post("/signup", verifyage, choosestream ,  async (req, res) => {
    try {

        // Example object (commented example)
        // const userobj = {
        //     firstName: "Sample3 name",
        //     lastName: "Sample3 lastname",
        //     password: "sample2@342",
        //     email: "sample2@321",
        //     gender: "Male",
        //     age: 23
        // }

        // const user = new User(userobj)
        
        // Creating new user using request body
        const user = new User(req.body)

        // console.log(req.body)

        // Example validation check (commented)
        // if (!user.email) {
        //     throw new Error("Email is required")
        // }

        // Save user into database
        await user.save()

        console.log(user)

        res.status(201).send("User added successfully to the database.")
    } catch (error) {
        res.status(400).json({
            message: "Bad request",
            error: error.message
        })
    }
})



// =======================================================
// GET USERS BY EMAIL (Multiple users)
// =======================================================

// This finds users by matching email
server.get("/usersbyEamil", async (req,res)=>{
    
     const {userEmail} = req.body   // Getting email from request body

try{
    // Find all users matching this email
    const usersData = await User.find({email : userEmail})

    if(usersData.length > 0){
        res.send(usersData)
    }else{
        res.send("user not found.")
    }
}catch(error){
res.status(400).send("Invalid Email.")
}
})


// =======================================================
// GET ONE USER USING findOne()
// =======================================================

server.get("/oneuser", async (req, res) => {

    const {userEmail} = req.body;  // Getting email from request body

    try {

        // Check if email provided
        if (!userEmail) {
            return res.status(400).send("Email is required");
        }

        // Find single user
        const userEmaildata = await User.findOne({ email: userEmail });

        if (!userEmaildata) {
            return res.status(404).send("User not found");
        }

        res.send(userEmaildata);

    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});



// =======================================================
// FEED API - Get All Users
// =======================================================

// Returns all documents from User collection
server.get("/feed",  async (req,res) =>{
try{

const usersfeed = await User.find();

if(usersfeed.length === 0){
   return  res.send("Feed is Empty.")
}

res.send(usersfeed)

}catch(error){
res.status(400).send("Something wrong in feed.")
}
})



// =======================================================
// GET USER BY ID
// =======================================================

// Fetch single user using MongoDB ObjectId
server.get("/userid", async (req, res) => {

    const {UserId} = req.body   // Getting UserId from request body

    try {
        // const { id } = req.params;

        // Find user by ID
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



// =======================================================
// DELETE USER
// =======================================================

// Deletes user by ID
server.delete("/deleteuser", async(req,res)=>{
    const {UserId} = req.body   // Getting UserId from body
    
    try{

        console.log(UserId)

        // const user = await User.findByIdAndDelete({_id : UserId})

        const user = await User.findByIdAndDelete(UserId);

        res.send("Successfully Deleted User from Database.")

    }catch(error){
        res.status(400).send("Invalid User ID.")
    }
})



// =======================================================
// UPDATE USER (PATCH)
// =======================================================

// Updates user data using ID
server.patch("/UpdateUser" , async(req,res)=>{
    
    const{UserId} = req.body   // User ID
    const {Data} = req.body    // Data to update
    

    try{

    // Update user document
    const user = await User.findByIdAndUpdate({_id : UserId} , Data)

    if(!user){
        return res.send("Erorr updating user")
    }else{

    runValidators : true;   // (Not active here - just written)
    res.send("User Updated Successfully.")
    }

    }catch(error){
        res.status(400).send("Invalid User ID , having error in updating user.")
    }
})


// Improved update version (commented example)
// server.patch("/UpdateUser", async (req, res) => {
//   const { UserId, Data } = req.body;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       UserId,
//       Data,
//       {
//         new: true,
//         runValidators: true
//       }
//     );

//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }

//     res.status(200).send("User updated successfully");
//   } catch (error) {
//     res.status(400).send("Invalid User ID or error updating user");
//   }
// });



// =======================================================
// DATABASE CONNECTION & SERVER START
// =======================================================

// Connect to MongoDB first
connectDB()
    .then(() => {
        console.log("MongoDB Connected Successfully")

        // Start server only after DB connection is successful
        server.listen(port, () => {
            console.log("Server running on port " + port)
        })
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error)
    })