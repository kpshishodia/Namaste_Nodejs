
const mongoose = require("mongoose")
// import validator from 'validator';
const validator = require("validator")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


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
    },

    avatar : {
        type : String, // cloud service privider
        required : true,
    },

    coverImage : {
        type : String,
    },

    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    rsfreshtoken : {
        type : String,
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

 
userSchema.pre("save" , async function (next) {

    if(!this.isModified("password")) return next ();
    
    this.password = bcrypt.hash(this.password , 10)
    next()
})




const User = mongoose.model(
  "User",                  // model name (ANYTHING)
  userSchema,
  "Auth_cookies_JWT_tokkens" // collection name (VERY IMPORTANT)
);



module.exports = User;