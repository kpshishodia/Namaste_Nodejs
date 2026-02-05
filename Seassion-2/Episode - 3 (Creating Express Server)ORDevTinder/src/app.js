const express = require("express")
const port = 3000;
const server = express();
const user = "Karan Pratap"
    const userdata = {
        firstname: "Kumar", 
        lastname: "Sanu",
        City: "Mumbai",
        Gender : "Male",
    }


// server.use((req,res) =>{
//     if(req.url === "/verifyuser"){
//         res.send(`Congrats ${user} you are human go ahead Son .`)
//     }
//     else{
//     res.send(`Hello ${user} from server port : ${port}`)
//     }
// })


// server.get("/user" , (req,res) => {
//      res.send(`user data : ${userdata}`)
// })

server.use("/home/2" , (req,res) => {
     res.send(`Congrats ${user} you are  on Home Page-2  Son .`)
     console.log("We are in home/2")
})

server.use("/home" , (req,res) => {
     res.send(`Congrats ${user} you are  on Home Page Son .`)
     console.log("We are in home")
    //  res.send(`Congrats ${user} you are  on Home Page-2  Son .`)
})



server.use("/VerifyUser" , (req,res) => {
     res.send(`Congrats ${user} you are on Verify  Page  Son .`)
     console.log("We are in verify user")
})

server.use("/testing" , (req,res) => {
     res.send(`Congrats ${user} you are on Testing Phase Page  Son .`)
     console.log("We are in testing")
})
server.use("/" , (req,res) =>{
     res.send(`Congrats ${user} you are  welcome to our App  Son.`)
})


// server.get("/user" , (req,res) => {
//      res.send({userdata})
// })

server.listen(port, () => {
    console.log("Server running on port " + port)
}) 






