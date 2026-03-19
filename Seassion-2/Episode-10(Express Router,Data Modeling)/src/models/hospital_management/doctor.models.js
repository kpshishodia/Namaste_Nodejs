const mongoose = require("mongoose")

const {Schema} = mongoose

const doctorSchema = new Schema({

},{timestamps : true})

const Doctor = mongoose.model("Doctor" , doctorSchema , Doctor)

module.exports = Doctor