const Store = require("../models/storeModel");
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

exports.renderProductForm = (req, res) => res.status(200).render("add-product");

exports.renderProducts = (req, res) => res.status(200).render("products");
