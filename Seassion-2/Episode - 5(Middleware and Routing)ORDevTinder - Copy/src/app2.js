
const express = require("express")
const port = 4002
const server = express()
const user = "Karan Pratap"
const userData = {
     Name : "Karan",
     Gender : "Male",
     Country : "india",
     phn : "9088989843",
     Age : 22
}

const { AdminAuth , UserAuth } = require("./middleware/Auth")


// // handle  Auth middleware  for GET POST ... requests 

// server.use("/admin" , (req,res,next) =>{
//      console.log("Admin Auth getting checked.")
//      const token = "xyz"
//      const isuserauthorized = token === "xyz"

//      if(!isuserauthorized){
//           res.status(401).send("Unauthorized request.")
//      }else{
//           next()
//      }
// })


// Admin middleware
server.use("/admin", AdminAuth)

server.get("/admin/getAllData", (req, res) => {
    res.send(`Hello ${user} Data Sent from admin.`)
})

server.get("/admin/deleteuser", (req, res) => {
    res.send(`Hello ${user} Data Deleted from admin.`)
})

// User middleware
server.use("/user", UserAuth)

server.get("/user/getdata", (req, res) => {
    res.json(userData)
})

server.get("/user/verifyuser", (req, res) => {
    if (userData.Age < 18) {
        res.status(401).send(`${user} you are monor So, you cannot vote for now .`)
    } else {
        res.send(`Congrats! ${user} You are an adult, you can vote now.`)
    }
})


server.listen(port, () => {
    console.log("Server running on port " + port)
})
