require("dotenv").config();
const express = require("express")
const cookierParser = require("cookie-parser")

const app = express()

// app.use(cors())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))


module.exports = app