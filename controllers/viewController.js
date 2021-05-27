const Store = require("../models/storeModel");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

exports.renderIndex = (req, res, next) => {
  res.status(200).render("index");
};

exports.renderDashboard = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });

  res.status(200).render("dashboard", { store });
});

exports.renderCreateStoreForm = (req, res) =>
  res.status(200).render("create-store");

exports.renderProductForm = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });
  res.status(200).render("add-product", { store });
});

exports.renderProductsDashboard = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });

  const products = await Product.find({ store: store._id });

  res.status(200).render("products", { store, products });
});

exports.renderStoreDetail = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });
  const products = await Product.find({ store: store._id });

  res.status(200).render("store-detail", { store, products });
});

exports.renderProductDetail = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });
  const allProducts = await Product.find({ store: store._id });

  let product = "";

  allProducts.forEach((prod) => {
    if (prod.slug !== req.params.productSlug) return;
    product = prod;
  });

  res.status(200).render("product-detail", { store, product, allProducts });
});

exports.renderCartPage = (req, res) => {
  res.status(200).render("cart");
};
