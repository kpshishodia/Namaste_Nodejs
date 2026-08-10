const express = require("express");
const port = 7000;
const server = express();
const jwt = require("jsonwebtoken")
const ConnectToDB = require("./config/Database");
const User = require("./models/user");
const ValidateSignUpdata = require("./utils/Validation");
const {UserAuth} = require("./middleware/Auth.js")
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

server.use(express.json());
server.use(cookieParser());


// ================= MIDDLEWARE =================


// Verify age middleware
const verifyAge = (req, res, next) => {
    try {
        const { age } = req.body;

        if (!age) {
            return res.status(400).json({
                message: "Age is required."
            });
        }

        if (age < 18) {
            return res.status(400).json({
                message: "User must be 18+."
            });
        }

        next();

    } catch (error) {
        return res.status(400).json({
            message: "Bad request.",
            error: error.message
        });
    }
};


// Verify stream middleware
const chooseStream = (req, res, next) => {
    try {
        const { stream } = req.body;

        if (!stream) {
            return res.status(400).json({
                message: "Stream is required."
            });
        }

        const allowedStreams = [
            "science",
            "commerce",
            "arts"
        ];

        if (!allowedStreams.includes(stream.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid stream. Allowed streams are science, commerce, or arts."
            });
        }

        next();

    } catch (error) {
        return res.status(400).json({
            message: "Bad request.",
            error: error.message
        });
    }
};



// ================= SIGNUP ROUTE =================


server.post("/signUp", verifyAge, chooseStream, async (req, res) => {

    try {

        const allowedFields = [
            "firstName",
            "lastName",
            "gender",
            "email",
            "password",
            "age",
            "about",
            "skills",
            "stream"
        ];


        // Check extra fields
        const isValid = Object.keys(req.body).every((field) =>
            allowedFields.includes(field)
        );


        if (!isValid) {
            return res.status(400).json({
                message: "Only valid fields are allowed."
            });
        }


        // Custom validation
        ValidateSignUpdata(req);



        const {
            firstName,
            lastName,
            gender,
            email,
            password,
            age,
            about,
            skills,
            stream
        } = req.body;



        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);



        const user = new User({

            firstName,
            lastName,
            gender,
            email,
            password: hashPassword,
            age,
            about,
            skills,
            stream

        });



        await user.save();



        return res.status(201).json({
            message: "User added successfully."
        });



    } catch (error) {

        return res.status(400).json({
            message: "Bad request.",
            error: error.message
        });

    }

});

server.post("/Login", async (req,res) => {
try{

    const {email,password} = req.body

    if(!email || !password){
        return res.status(400).json({
            message: "Email and password are required."
        })
    }

    const user = await User.findOne({email: email})
    if(!user){
        throw new Error ("no user found in DB with this eamil.")
    }

    const isPasswordValid = await bcrypt.compare(password , user.password)
    if(!isPasswordValid){
        throw new Error ("invalid password.")
    }

    // create jwt 

    if(isPasswordValid){
        const token =  await jwt.sign({_id:user._id}, "TopSecret")

        console.log(`jwt token : ${token}`)

        // create cookie 

        res.cookie("token" , token)
        res.send("Login successfully.")
    }else{
        throw new Error ("Login failed invalid credentials.")
    }

}catch(error){
    res.status(400).json({
        message: "bad request",
        error: error.message
    })
}
});

server.get("/profile", UserAuth, async (req, res) => {

    try {

        const user = req.user;


        console.log("user:", user);


        return res.status(200).json({
            message: "Profile fetched successfully.",
            user
        });


    } catch (error) {

        return res.status(400).json({
            message: "Invalid or expired token.",
            error: error.message
        });

    }

});

server.post("/LogOut", async (req,res) =>{
    try{
        res.clearCookie("token");
        res.status(200).json({
            message: "LogOut Successfully."
        })
    }catch(error){
        res.status(400).json({
            message: "Logout failed",
            error: error.message
        })
    }
});

server.post("/SendConnectionRequest", UserAuth, async (req,res) =>{
try{

    const user = req.user

    console.log("checking Sendrequest API")

     res.send( user.firstName + " " + "sending the connection request.")



}catch(error){
    res.status(400).json({
        message: "unsuccessfull connection request.",
        error: error.message
    })
}
});
// ================= DATABASE CONNECTION =================


ConnectToDB()
    .then(() => {

        console.log("MongoDB Connected Successfully");


        server.listen(port, () => {

            console.log(`Server running on port ${port}`);

        });

    })
    .catch((error) => {

        console.error(
            "MongoDB Connection Failed:",
            error
        );

    });