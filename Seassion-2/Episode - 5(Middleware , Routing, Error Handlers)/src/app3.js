// Importing Express
const express = require("express")

// Port number where server will run
const port = 3005

// Creating Express application
const server = express()

// Sample variable (not used in logic, just for demo)
const user = "Sample User"


/* =====================================================
   MULTIPLE MIDDLEWARE FUNCTIONS IN ONE ROUTE
   ===================================================== */

/*
You can pass multiple functions in a single route.
Each function must call next() to move forward,
unless it sends a response.

Flow:
Request → Middleware 1 → Middleware 2 → Middleware 3 → Response
*/

server.get("/userdata",

    // Middleware 1
    (req, res, next) => {
        console.log("Response - 1")
        next()  // Move to next middleware
    },

    // Middleware 2
    (req, res, next) => {
        console.log("Response - 2")
        next()  // Move to next middleware
    },

    // Final Handler
    (req, res) => {
        console.log("Response - 3")
        res.send("result-3")  // This ends the request-response cycle
    }
)


/* =====================================================
   ROUTE THAT THROWS AN ERROR
   ===================================================== */

// Defining a GET route at "/getuserData"
server.get("/getuserData", (req, res, next) => {
    try {
        // Intentionally throwing an error to simulate something going wrong
        throw new Error("Phalana Dikra Error")

        // This line would normally send response if no error occurred
        // res.send("User data sent successfully")
    } catch (err) {
        // Pass error to global error handler
        next(err)
    }
})


/* =====================================================
   404 NOT FOUND HANDLER
   ===================================================== */

/*
This middleware handles all requests that do not match any route.
It must be placed AFTER all routes.
*/

server.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})


/* =====================================================
   GLOBAL ERROR HANDLING MIDDLEWARE
   ===================================================== */

/*
Catches all errors passed with next(err)
or thrown synchronously in routes.
Must have 4 parameters to be recognized as error middleware.
*/

server.use((err, req, res, next) => {
    console.log("Global Error:", err.message)  // Logs error for debugging

    res.status(500).json({
        success: false,
        message: "Something went wrong."
    })
})


/* =====================================================
   STARTING THE SERVER
   ===================================================== */

server.listen(port, () => {
    console.log("Server running on port " + port)
})