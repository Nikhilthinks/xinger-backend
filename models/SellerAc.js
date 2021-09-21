const mongoose = require('mongoose')
const SellerSchema = new mongoose.Schema({   
accountNo: {
    type: String,
    required: true,
},
bank: {
    type: String,
    required: true
},
ifsc: {
    type: String,
    required: true
},
AcName: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true,
    unique: true
}
})

module.exports = SellerAc = mongoose.model('sellerAc',SellerSchema)