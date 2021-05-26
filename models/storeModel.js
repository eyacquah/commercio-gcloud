const mongoose = require("mongoose");
const slugify = require("slugify");
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  stats: {
    numOfSales: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalCommissions: {
      type: Number,
      default: 0,
    },
    commissionsPaid: {
      type: Number,
      default: 0,
    },
    numOfProducts: {
      type: Number,
      default: 0,
    },
  },
  image: String,
  date: String,
  slug: String,
});

StoreSchema.pre("save", function (next) {
  this.slug = slugify(this.storeName, { lower: true });

  // Create Human Readable Date
  const date = new Date(Date.parse(this.createdAt));
  const options = {
    year: "numeric",
    month: "long",
  };

  this.date = date.toLocaleString("en-GB", options);
  next();
});

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
