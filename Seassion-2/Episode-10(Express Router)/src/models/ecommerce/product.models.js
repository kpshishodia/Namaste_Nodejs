const mongoose = require("mongoose")

const {Schema} = mongoose

const productSchema = new Schema({
description: {
    type: String,
    required: true,
},

name: {
    type: String,
    required: true,
},

productImage: {
    type: String
},

price: {
    type: Number,
    default: 0,
},
stock: {
    type: Number,
    deafault: 0,
},

category: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Category",
   required: true,
},
owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User2"
}

},{timestamps: true})

const Product = mongoose.model("Product" , productSchema, "Product")


module.exports = Product