// Importing Express framework
const express = require("express")

// Defining the port number
const port = 3003;

// Creating an Express application
const server = express();

// Simple variable for response message
const user = "Karan Pratap"

// Sample user data object (not used in this example, just declared)
const userdata = {
    firstname: "Kumar", 
    lastname: "Sanu",
    City: "Mumbai",
    Gender : "Male",
}

/* =====================================================
   MIDDLEWARE CHAIN USING server.use()
   ===================================================== */

/*
server.use("/user", ...)

This means:
→ These middleware functions will run ONLY when the URL starts with "/user"
Example:
✔ http://localhost:3002/user
✔ http://localhost:3002/user/123
✔ http://localhost:3002/user/profile

❌ http://localhost:3002/home  (will NOT run)
*/

server.use("/user" , 

// Middleware 1
(req , res , next) => {
     console.log("Response - 1")

     /*
     If we send a response here using res.send(),
     the request-response cycle ends
     and next middleware will NOT execute.
     */

     // Passing control to next middleware
     next();
},

// Middleware 2
(req,res,next) => {
     console.log("Response - 2")

     // Passing control to next middleware
     next();
},

// Middleware 3
(req,res,next) => {
     console.log("Response - 3")

     // Passing control to next middleware
     next();
},

// Middleware 4 (Final Middleware)
(req,res,next) => {
     console.log("Response - 4")

     /*
     res.send() sends response to client
     and ENDS the request-response cycle.
     After this, no more middleware runs.
     */
     res.send(`Congrats ${user} you are on user page from response -4 Son.`)
})

/* =====================================================
   STARTING THE SERVER
   ===================================================== */

// Start the server on defined port
server.listen(port, () => {
    console.log("Server running on port " + port)
})