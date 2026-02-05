const express = require("express")
const port = 4003
const server = express()
const user = "Sample User"

server.get("/userdata" , (req , res , next) => {
console.log("Response - 1")
// res.send("result-1")
next()
},
(req , res , next) =>{
console.log("Response - 2")
// res.send("result-2")
next()
},
(req,res,next) => {
console.log("Response - 3")
res.send("result-3")
}
)


server.listen(port , () =>{
    console.log("Server running on port " + port)
})