const mongoose = require("mongoose");
const backpackSchema = new mongoose.Schema({
  
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },  

    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package Details"
    },
    //   username: user.username,
    //   user_name: user.name,
    //   contact: user.phone

    username: {
    type: String
    },

    user_name: {
        type: String
    },
    contact: {
        type: String
    },

    tripDate: {
    type: Date
    },

});

module.exports = User = mongoose.model("backpack", backpackSchema);