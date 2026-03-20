const express = require("express")
// Import User model (MongoDB schema)
const User = require("../models/user")
const connectionrequestRouter = express.Router()

// Import authentication middleware
const {UserAuth} = require("../middleware/Auth")
// Middleware → parses incoming JSON body
connectionrequestRouter.use(express.json()); 

connectionrequestRouter.post("/SendConnectionRequest",  UserAuth , async (req,res) => {
  try{
       // UserAuth middleware already:
    // 1. Reads cookie
    // 2. Verifies token
    // 3. Fetches user from DB
    // 4. Attaches user to req.user

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

  

 




module.exports = connectionrequestRouter




