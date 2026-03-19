const mongoose = require("mongoose")

const {Schema} = mongoose

const hospitalSchema = new Schema({

} , {timestamps : true})

const Hospital = mongoose.model("Hospital" , hospitalSchema , Hospital)

module.exports = Hospital