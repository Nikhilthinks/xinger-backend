const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
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

  // Country: {
  //   Type: String
  // },

  // City: {
  //   Type: String
  // },
  // Create a list of countries and their respective cities for this field, this will be an optional feature to add country and city

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

  followers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],

  following: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],

  roles: {
    type: String,
    enum : ['user', 'agent', 'superuser'],
    required: true
  },

  bucketTripName: {
  type: String
  },

  bucketTripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package Details"
  },

  bucketListDreamDate: {
  type: Date
  },

  visitedPlaces: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", userSchema);
