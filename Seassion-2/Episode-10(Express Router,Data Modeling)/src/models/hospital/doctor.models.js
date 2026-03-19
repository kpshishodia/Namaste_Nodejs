const mongoose = require("mongoose")

const {Schema} = mongoose

const doctorSchema = new Schema({

},{timestamps : true})

const Doctors = mongoose.model("Doctors" , doctorSchema , Doctors)

module.exports = Doctors