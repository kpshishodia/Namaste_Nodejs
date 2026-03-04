
const mongoose = require("mongoose")

const {Schema} = mongoose

const orderItemSchema = new this.Schemachema({
productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
},

quantity: {
    type: Number,
    required: true
}
})

const orderSchema = new Schema({
orderPrice: {
    type: Number,
    required: true,
},
customer: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User2"
},
orderItems: {
type: [orderItemSchema]
},

adress: {
    type: String
}
},{timestamps: true})

const Order = mongoose.model("Order", orderSchema, "Order")

module.exports = Order