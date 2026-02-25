

const express = require("express")
const port = 4000
const server = express()
const connectDB = require("./config/Database")
const User = require("./models/user")
server.use(express.json()); 



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


// stream middleware

const choosestream = (req, res, next) => {
    const { stream } = req.body;

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


// signup API - to add data fromm postoman to databse

server.post("/signup", verifyage, choosestream ,  async (req, res) => {
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
        
        const user = new User(req.body)
        // console.log(req.body)

        // if (!user.email) {
        //     throw new Error("Email is required")
        // }

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


// user API - geting single user from databse

// get user by email
server.get("/user", async (req,res)=>{
    // const userEmail = req.body.userEmail
     const {userEmail} = req.body
try{
    const userdata = await User.find({email : userEmail})
    res.send(userdata)

}catch(error){
res.status(400).send("Invalid Email.")
}
})

// // get user by findone method 


server.get("/oneuser", async (req, res) => {

    const {userEmail} = req.body;

    try {

        if (!userEmail) {
            return res.status(400).send("Email is required");
        }

        const userEmaildata = await User.findOne({ email: userEmail });

        if (!userEmaildata) {
            return res.status(404).send("User not found");
        }

        res.send(userEmaildata);

    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});



// feed API - to find all documents or all users from database

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

// Model.findById() - get user by id

server.get("/userid", async (req, res) => {

    const {UserId} = req.body
    try {
        // const { id } = req.params;
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



// Delete User API

server.get("/deleteuser", async(req,res)=>{
    const {UserId} = req.body
    try{
        // const user = await User.findByIdAndDelete({_id : UserId})
        const user = await User.findByIdAndDelete(UserId);
        res.send("Successfully Deleted User from Database.")

    }catch(error){
        res.status(400).send("Invalid User ID.")
    }
})


// Update User Data - Patch API  Model.findByIdAndUpdate()

// server.patch("/UpdateUser" , async(req,res)=>{
//     const{UserId} = req.body
//     const {Data} = req.body
    

//     try{
//     const user = await User.findByIdAndUpdate({_id : UserId} , Data)

//     runValidators : true;
//     res.send("User Updated Successfully.")
//     }catch(error){
//         res.status(400).send("Invalid User ID , having error in updating user.")
//     }
// })

server.patch("/UpdateUser", async (req, res) => {
  const { UserId, Data } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      UserId,        // pass ID directly
      Data,          // fields to update
      {
        new: true,           // return updated document
        runValidators: true  // run schema validations
      }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(400).send("Invalid User ID or error updating user");
  }
});


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


    



