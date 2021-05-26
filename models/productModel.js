const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.ObjectId,
    required: [true, "A product must belong to a store"],
    ref: "Store",
  },
  title: {
    type: String,
    required: [true, "A product must have a title"],
    unique: true,
    trim: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, "A product must have a description"],
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
  },
  images: [String],
  numOfSales: Number,
});

///////////////////////////////////////////////////////
////// DOCUMENT MIDDLEWARE

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
