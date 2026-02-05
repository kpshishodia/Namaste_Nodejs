const express = require("express")
const port = 3001;
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

server.get("/home/2" , (req,res) => {
     res.send(`Congrats ${user} you are  on Home Page-2  Son .`)
})

server.get("/home" , (req,res) => {
     res.send(`Congrats ${user} you are  on Home Page Son .`)
    //  res.send(`Congrats ${user} you are  on Home Page-2  Son .`)
})



server.get("/VerifyUser" , (req,res) => {
     res.send(`Congrats ${user} you are on Verify  Page  Son .`)
})

server.get("/testing" , (req,res) => {
     res.send(`Congrats ${user} you are on Testing Phase Page  Son .`)
})
server.get("/" , (req,res) =>{
     res.send(`Congrats ${user} you are  welcome to our App  Son.`)
})


server.get("/user" , (req,res) => {
     res.send({userdata})
})
// server.post("/user" , (req,res) =>{
//     res.send(`Successfully added user data in database  hers is the data : ` , {userdata})
// })


server.post("/user", (req, res) => {
  res.json({
    message: "Successfully added user data in database.",
    userdata,
  });
});


server.listen(port, () => {
    console.log("Server running on port " + port)
}) 

