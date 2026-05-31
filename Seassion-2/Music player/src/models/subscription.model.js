import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new  Schema({
subsscriber : {
    type : Schema.Types.ObjectId,
    ref: "User"
}
},

{
    channel :{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},

{
    count : {
        type : Number
    }
},
{
    timestamps: true
})



// -----------------------------
// 🧠 Create Model
// -----------------------------
const subscription = mongoose.model(
  "subscription", // model name used in code
  subscriptionSchema,
  "ytuser subs" // collection name in MongoDB
);

export default subscriptionSchema