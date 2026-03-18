
const mongoose = require("mongoose")

const {Schema} = mongoose

const userSchema = new Schema({

    firstName : {
        type : String,
        required : true,
        trim : true,    
    }, 

    lastName : {
        type : String,
        required : true,
        trim : true,
    },

    gender : {
        type : String,
        required : true,
        lowercase : true,
    
        validate(value){
            if(!["male" , "female" , "others"].includes(value) ){
                throw new Error("gender is invalid");
            }
        }
    },

    email : {
        type : String,
        trim : true,
    },

    password : {
        type : String,
        required : true,
        trim : true,
    },

    age : {
        type : Number
    },

    stream : {
        type: String
    },

    about : {
        type : String,
        default : "This is default Message for about."
    }
     
},
{
    timestamps : true
})

 
const User = mongoose.model("User" , userSchema);


module.exports = User;



