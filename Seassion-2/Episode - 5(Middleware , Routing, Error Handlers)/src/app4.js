const express = require("express")
const port = 3006
const server = express()
const ConnectToDB = require("./config/Database")
const user = "Karan Pratap"

ConnectToDB()
.then(() =>{
    console.log("Successfully connected to DB ...")
   server.listen(port, () => {
    console.log("Server running on port " + port)
})
})
.catch((error) =>{
    console.error("Failed to connect to DB" , error)
})




