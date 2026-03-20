
const mongoose = require("mongoose")

const {Schema} = mongoose

const orderItemSchema = new Schema({
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
    type: String,
    required: true
},
status: {
    type: String,
    enum: ["PENDING", "CANCELLED", "DELIVERDED"],
    default: "PENDING"
}
},{timestamps: true})

const Order = mongoose.model("Order", orderSchema, "Order")

module.exports = Order