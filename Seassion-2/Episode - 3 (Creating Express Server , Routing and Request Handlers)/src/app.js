
// Import express framework
const express = require("express");

// Define port number
const port = 3001;

// Create express application
const server = express();

// Simple string variable
const user = "Karan Pratap";

// User data object
const userdata = {
    firstname: "Kumar", 
    lastname: "Sanu",
    City: "Mumbai",
    Gender: "Male",
};


// -----------------------------
// GET Route → /user
// -----------------------------
server.get("/user", (req, res) => {
     res.send(userdata);
});


// -----------------------------
// Middleware Route → /home/2
// -----------------------------
server.use("/home/2", (req, res) => {

     // Sends response for /home/2
     res.send(`Congrats ${user} you are on Home Page-2 Son.`);
     
     // Console log runs on server side only
     console.log("We are in home/2");
});


// -----------------------------
// Middleware Route → /home
// -----------------------------
server.use("/home", (req, res) => {

     res.send(`Congrats ${user} you are on Home Page Son.`);
     console.log("We are in home Son.");
});


// -----------------------------
// Middleware Route → /VerifyUser
// -----------------------------
server.use("/VerifyUser", (req, res) => {

     res.send(`Congrats ${user} you are on Verify Page Son.`);
     console.log("We are in verify user");
});


// -----------------------------
// Middleware Route → /testing
// -----------------------------
server.use("/testing", (req, res) => {

     res.send(`Congrats ${user} you are on Testing Phase Page Son.`);
     console.log("We are in testing");
});


// -----------------------------
// Default Route → /
// -----------------------------
server.use("/", (req, res) => {

     res.send(`Congrats ${user} you are welcome to our App Son.`);
});


// Start the server
server.listen(port, () => {
    console.log("Server running on port " + port);
});