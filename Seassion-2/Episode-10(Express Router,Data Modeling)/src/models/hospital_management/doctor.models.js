const mongoose = require("mongoose")

const {Schema} = mongoose

const doctorSchema = new Schema({

name : {
    type : String,
    required : true
},

salary : {
    type : Number,
    required : true
},

qualification : {
    type : String,
    required : true
},

experience : {
    type : String,
    required : true,
    default : 0
},

worksInHospitals : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hospital"
    }
]

},{timestamps : true})

const Doctor = mongoose.model("Doctor" , doctorSchema , Doctor)

module.exports = Doctor