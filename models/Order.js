const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    buyerId: {
    type: Schema.Types.ObjectId,
    ref: "user"
    },

    username: {
        type: String,
        ref: "user"
    },

    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "seller"
    },
    
    sellerName: {
        type: String,
        ref: "seller"
    },

    amount: {
        type: Number,
    },

    packageId: { 
        typeof: Schema.Types.ObjectId,
    },
    rzpObject: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = Order = mongoose.model("order", OrderSchema);