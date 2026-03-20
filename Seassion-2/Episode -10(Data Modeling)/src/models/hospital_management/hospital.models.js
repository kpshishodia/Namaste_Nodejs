const mongoose = require("mongoose")

const {Schema} = mongoose

const hospitalSchema = new Schema({

    name : {
    type : String,
    required : true
},

address : {
    type : String,
    required : true
},

city : {
    type : String,
    required : true
},

specializedIn : [
    {
    type : String,
    required : true
}
],

reviews : [
    {
    type : String,
    required : true
}
]

} , {timestamps : true})

const Hospital = mongoose.model("Hospital" , hospitalSchema , Hospital)

module.exports = Hospital