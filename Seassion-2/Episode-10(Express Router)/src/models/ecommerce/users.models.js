const mongoose = require("mongoose");


const {Schema} = mongoose

const userSchema2 = new Schema({

    username:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    
    } ,

    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    
    } ,

    password:{
        type: String,
        required: true,
        unique: true,
    
    }
} , {timestamps: true})


const User2 = mongoose.model(
  "User2",                  // model name (ANYTHING)
  userSchema2,
  "Data Modeling" // collection name (VERY IMPORTANT)
);



module.exports = User2;