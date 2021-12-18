const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalonServiceSchema = new Schema({
  sellerId: {
  type: Schema.Types.ObjectId,
  ref: "user"
  },
  sellerName: {
    type: String
  },
  serviceName: {
    type: String,
    required: true
  },
  serviceCategory: {
    type: String,
    required: true
  },
  serviceDescription: {
    type: String
  },
  serviceStatus: {
      type: Boolean,
      default: true
  },
  descriptionPhotos: [
    {
      serviceImage: {
        type: String,
      },
    },
  ],
  price: {
      type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("salonservice", SalonServiceSchema);