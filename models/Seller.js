const mongoose = require("mongoose");
const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
  },

  phone: {
    type: String,
    unique: true
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Seller = mongoose.model("seller", sellerSchema);
