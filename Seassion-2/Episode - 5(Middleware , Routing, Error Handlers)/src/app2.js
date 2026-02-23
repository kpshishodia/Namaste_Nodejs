// Importing Express framework
const express = require("express")

// Defining port number
const port = 3004

// Creating Express application
const server = express()

// Sample user name
const user = "Karan Pratap"

// Sample user data (dummy database data)
const userData = {
     Name : "Karan",
     Gender : "Male",
     Country : "india",
     phn : "9088989843",
     Age : 22
}

// Importing custom middleware functions
// These were exported from ./middleware/Auth.js
const { AdminAuth , UserAuth } = require("./middleware/Auth")


/* =====================================================
   ADMIN ROUTES (Protected by AdminAuth Middleware)
   ===================================================== */

/*
server.use("/admin", AdminAuth)

This means:
→ Any request that starts with "/admin"
→ Will first go through AdminAuth middleware

Example:
✔ /admin/getAllData
✔ /admin/deleteuser

Flow:
Request → AdminAuth → Route Handler → Response
*/
server.use("/admin", AdminAuth)


// Route: GET /admin/getAllData
// Only accessible if AdminAuth allows it
server.get("/admin/getAllData", (req, res) => {
    res.send(`Hello ${user} Data Sent from admin.`)
})


// Route: GET /admin/deleteuser
// Also protected by AdminAuth
server.get("/admin/deleteuser", (req, res) => {
    res.send(`Hello ${user} Data Deleted from admin.`)
})



/* =====================================================
   USER ROUTES (Protected by UserAuth Middleware)
   ===================================================== */

/*
server.use("/user", UserAuth)

This means:
→ All routes starting with "/user"
→ Must pass UserAuth middleware first

Flow:
Request → UserAuth → Route Handler → Response
*/
server.use("/user", UserAuth)


// Route: GET /user/getdata
// Sends user data as JSON
server.get("/user/getdata", (req, res) => {
    res.json(userData)
})


// Route: GET /user/verifyuser
// Checks if user is adult (Age >= 18)
server.get("/user/verifyuser", (req, res) => {

    /*
    Checking age condition
    If Age < 18 → Unauthorized (cannot vote)
    */
    if (userData.Age < 18) {

        // 401 status = Unauthorized
        res.status(401).send(`${user} you are minor. So, you cannot vote for now.`)

    } else {

        // If age is 18 or above
        res.send(`Congrats! ${user} You are an adult, you can vote now.`)
    }
})



/* =====================================================
   STARTING THE SERVER
   ===================================================== */

// Start the server on defined port
server.listen(port, () => {
    console.log("Server running on port " + port)
})