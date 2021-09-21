const mongoose = require('mongoose')
const sellerSchema = new mongoose.Schema({ 
companyName: {
    type: String,
    required: true,
},
addressL1: {
    type: String,
    required: true
},
addressL2: {
    type: String,
},
country: {
    type: String,
    required: true
},
state: {
    type: String,
    required: true
},
pinCode: {
    type: String,
    required: true
},
taxNumber: {
    type: String,
    required: true
    //Add option to group business accounts with same tax number
},
email: {
    type: String,
    required: true,
    unique: true
}
})

module.exports = SellerInfo = mongoose.model("sellerInfo", sellerSchema);