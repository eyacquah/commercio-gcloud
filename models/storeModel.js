const mongoose = require("mongoose");
const validator = require("validator");

const StoreSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: [true, "A store must have a name"],
    trim: true,
    unique: true,
  },
  storeOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A store must have an owner"],
  },
  description: {
    type: String,
    required: [true, "A store must have a description"],
  },
  phoneNumber: {
    type: String,
    required: [true, "A store must have a phone number"],
    validate: [validator.isMobilePhone, "Enter a valid phone number"],
  },
  address: {
    country: String,
    region: String,
    city: String,
    streetAddress: String,
  },
  image: String,
  numOfProducts: Number,
  slug: String,
});

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
