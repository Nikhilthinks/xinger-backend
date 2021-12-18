const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
  },
  serviceName: {
    type: String,
    required: true
  },
  appointmentTime: {
    type: Number,
  },
  appointmentDate: {
      type: Date,
  },
  text: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("appointment", AppointmentSchema);