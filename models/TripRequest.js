const mongoose = require("mongoose");
const tripRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  usernameSentTo: {
    type: String,
    ref: "user",

  },
  usernameReceivedFrom: {
    type: String,
    ref: "user",

  },
  avatar: {
    type: String,
    ref: "user",
  },
  userReceiveRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null
  },
  userSendRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  tripRequestApproved: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null
  },

  date: {
    type: Date,
    default: Date.now,
  },

// Add PackageID from TourPackage.js

});

module.exports = TripRequest = mongoose.model(
  "TripRequests",
  tripRequestSchema
);
