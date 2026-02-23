const express = require("express")
const port = 4000;
const server = express();
const user = "Karan Pratap"
    const userdata = {
        firstname: "Kumar", 
        lastname: "Sanu",
        City: "Mumbai",
        Gender : "Male",
    }

server.use("/user" , (req , res , next) => {
     console.log("Respone - 1")
     // res.send(`Congrats ${user} you are  on user page from response -1  Son .`)
     next();
    
},
(req,res,next) => {
     console.log("Response - 2")
     // res.send(`Congrats ${user} you are  on user page from response -2  Son .`)
     next();
},
(req,res,next) => {
     console.log("Response - 3")
     // res.send(`Congrats ${user} you are  on user page from response -3  Son .`)
     next();
},
(req,res,next) => {
     console.log("Response - 4")
     res.send(`Congrats ${user} you are  on user page from response -4  Son .`)
})


server.listen(port, () => {
    console.log("Server running on port " + port)
}) 






