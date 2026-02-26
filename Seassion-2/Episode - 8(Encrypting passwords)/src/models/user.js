

const mongoose = require("mongoose")
// import validator from 'validator';
const validator = require("validator")

const {Schema} = mongoose

const userSchema = new Schema({

    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxlength : 20,
        lowercase : true,
    }, 

    lastName : {
        type : String,
        required : true,
        // unique : true,
    },

    gender : {
        type : String,
        required : true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid .")

            }
        },

        lowercase : true
    },

    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email.")
            }
        }
    },

    password : {
        type : String,
        required : true,
    },

    age : {
        type : Number,
        required : true,
    },

    about : {
        type : String,
        default : "This is default message about section.",

    },
    
    skills : {
        type : [String]
    }
     

    // skills : {
    //     type : [{
    //         type : String,
    //         trim : true,
    //     }]
    // }

    
}, {
    timestamps : true,
})

 
// const User = mongoose.model("User" , userSchema);
const User = mongoose.model(
  "Password_Encryption",
  userSchema,
  "Password_Encryption"
);




module.exports = User;