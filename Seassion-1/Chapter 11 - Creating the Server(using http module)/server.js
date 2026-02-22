

//http server 
// const http = require("node:http");
const http = require("http");
const port = 3000;
const server = http.createServer(function (req, res) {
    // res.end("Hello world")
    if (req.url === "/getSecretData") {
        res.end("You are a human and the the secret so chill")
    }
    // res.end("server Created")
res.end("Hello world")
    
})

server.listen(port, () => {
    console.log("Server running on port " + port)
}) 



