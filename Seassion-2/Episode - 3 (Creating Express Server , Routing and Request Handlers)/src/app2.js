// Importing Express framework
const express = require("express")

// Defining the port number where server will run
const port = 3002;

// Creating an Express application
const server = express();

// Simple variable to use in responses
const user = "Karan Pratap"

// Sample user data object (dummy database data)
const userdata = {
    firstname: "Kumar", 
    lastname: "Sanu",
    City: "Mumbai",
    Gender : "Male",
}

/* =====================================================
   ROUTES (Handling different URLs / Endpoints)
   ===================================================== */

// GET request for /home/2
// When user visits http://localhost:3001/home/2
// This route sends a simple text response
server.get("/home/2" , (req,res) => {
     res.send(`Congrats ${user} you are on Home Page-2 Son.`)
})

// GET request for /home
// When user visits http://localhost:3001/home
server.get("/home" , (req,res) => {
     res.send(`Congrats ${user} you are on Home Page Son.`)
})

// GET request for /VerifyUser
// When user visits http://localhost:3001/VerifyUser
server.get("/VerifyUser" , (req,res) => {
     res.send(`Congrats ${user} you are on Verify Page Son.`)
})

// GET request for /testing
// When user visits http://localhost:3001/testing
server.get("/testing" , (req,res) => {
     res.send(`Congrats ${user} you are on Testing Phase Page Son.`)
})

// Root route "/"
// Default route when user visits http://localhost:3001/
server.get("/" , (req,res) =>{
     res.send(`Congrats ${user} welcome to our App Son.`)
})

/* =====================================================
   QUERY PARAMETERS
   ===================================================== */

// GET request for /user using Query Parameters
// Example URL:
// http://localhost:3001/user?userId=101&password=1234
server.get("/user" , (req,res) => {

     // req.query is used to access query parameters
     // It returns an object containing key-value pairs
     // Example output: { userId: '101', password: '1234' }
     console.log(req.query)

     // Sending user data as JSON response
     res.send({ userdata })
})

/* =====================================================
   ROUTE PARAMETERS
   ===================================================== */

// GET request using Route Parameters (Dynamic URL values)
// Example URL:
// http://localhost:3001/user/101/1234/Karan
server.get("/user/:userId/:password/:name" , (req,res) =>{

     // req.params is used to access dynamic values in the URL
     // It returns an object like:
     // { userId: '101', password: '1234', name: 'Karan' }
     console.log(req.params)

     res.send({ userdata })
})

/* =====================================================
   POST REQUEST
   ===================================================== */

// POST request for /user
// Used to simulate adding user data to a database
// Usually POST requests send data inside request body
server.post("/user", (req, res) => {
  res.json({
    message: "Successfully added user data in database.",
    userdata,
  });
})

/* =====================================================
   STARTING THE SERVER
   ===================================================== */

// Make the server listen on the defined port
server.listen(port, () => {
    console.log("Server running on port " + port)
})