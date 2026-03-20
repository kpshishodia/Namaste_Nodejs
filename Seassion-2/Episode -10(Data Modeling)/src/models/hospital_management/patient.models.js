const mongoose = require("mongoose")

const {Schema} = mongoose

const patientSchema = new Schema({

name : {
    type : String,
    required : true
},

diagonsedWith : {
    type : String,
    required : true
},

address : {
    type : String,
    required : true
},

age : {
    type : Number,
    required : true
},

bloodGroup : {
    type : String,
    required : true
},

gender : {
    type : String,
    enum : ["Male" , "Female" , "Others"],
    required : true
},

admittedIn : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Hospital",
    required : true
},


},{timestamps : true})

const Patient = mongoose.model("Patient" , patientSchema , Patient)