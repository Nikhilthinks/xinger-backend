const mongoose = require('mongoose')
const PackageSchema = new mongoose.Schema({
    sellerId: {
         type: mongoose.Schema.Types.ObjectId
        },
        
    productName: {
        type: String
    },

    productDetails: {
        type: String
    },

    tripDate: {
        type: Date
    },
    tripEndDate: {
        type: Date
    },

    price: {
        type: String
    },

    sellerName: {
        type: String
    },

    uploadDate: {
        type: Date,
        default: Date.now
    },
    
    bookings : {
        type: Number,
        default: 0
    },

    visited: {    
        type: Number,
        default: 0
    },
    purchased: {
        type: Boolean,
        default: false
    }
})

module.exports = Package = mongoose.model("Package Details", PackageSchema)