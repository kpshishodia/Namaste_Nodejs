/*
=====================================================
   AUTHENTICATION MIDDLEWARE FUNCTIONS
=====================================================

These functions are used to protect routes.
They check whether a user/admin is authorized
before allowing access to a route.

Each middleware function receives:
- req  → request object
- res  → response object
- next → function to pass control to next middleware
*/


// ================= ADMIN AUTH MIDDLEWARE =================
const AdminAuth = (req, res, next) => {

    // This log helps us see in console when admin auth runs
    console.log("Admin Auth getting checked.")

    /*
    Normally, token comes from:
    - req.headers.authorization
    - req.body
    - cookies
    But here we are hardcoding it for learning purposes.
    */
    const token = "xyz"

    // Checking if token matches expected value
    const isAdminAuthorized = token === "xyz"

    // If NOT authorized → send error response
    if (!isAdminAuthorized) {

        // 401 = Unauthorized HTTP status code
        res.status(401).send("Unauthorized request.")

        /*
        IMPORTANT:
        When we send a response here,
        the request-response cycle ends.
        next() should NOT be called.
        */

    } else {

        // If authorized → move to next middleware/route handler
        next();
    }
}


// ================= USER AUTH MIDDLEWARE =================
const UserAuth = (req, res, next) => {

    // Console log to track execution
    console.log("User Auth getting checked.")

    // Hardcoded token (for learning/demo)
    const token = "xyz"

    // Check if token is valid
    const isUserAuthorized = token === "xyz"

    if (!isUserAuthorized) {

        // If invalid → send Unauthorized response
        res.status(401).send("Unauthorized request.")

    } else {

        // If valid → allow request to continue
        next();
    }
}


/*
=====================================================
   EXPORTING MIDDLEWARE FUNCTIONS
=====================================================

module.exports allows these functions to be used
in another file (like your main server file).

Example usage in another file:

const { AdminAuth, UserAuth } = require("./auth");

server.get("/admin", AdminAuth, (req, res) => {
    res.send("Welcome Admin");
});
*/

module.exports = {
    AdminAuth,
    UserAuth
}