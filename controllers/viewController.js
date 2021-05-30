const Store = require("../models/storeModel");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

exports.renderIndex = (req, res, next) => {
  res.status(200).render("index", { title: "Home" });
};

exports.renderDashboard = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });

  res
    .status(200)
    .render("dashboard", { store, title: `${store.storeName} | Dashboard` });
});

exports.renderCreateStoreForm = (req, res) =>
  res.status(200).render("create-store", { title: "Create Your Store" });

exports.renderProductForm = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });
  res.status(200).render("add-product", {
    store,
    title: `${store.storeName} | Add Product`,
  });
});

exports.renderProductsDashboard = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });

  const products = await Product.find({ store: store._id });

  res.status(200).render("products", {
    store,
    products,
    title: `${store.storeName} | Products`,
  });
});

exports.renderStoreDetail = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });
  const products = await Product.find({ store: store._id });

  res
    .status(200)
    .render("store-detail", { store, products, title: store.storeName });
});

exports.renderProductDetail = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });
  const allProducts = await Product.find({ store: store._id });

  let product = "";

  allProducts.forEach((prod) => {
    if (prod.slug !== req.params.productSlug) return;
    product = prod;
  });

  res.status(200).render("product-detail", {
    store,
    product,
    allProducts,
    title: product.title,
  });
});

exports.renderCartPage = (req, res) => {
  res.status(200).render("cart", { title: "cart" });
};

exports.renderCheckoutPage = (req, res) => {
  res.status(200).render("checkout", { title: "Checkout" });
};

exports.renderShippingPage = (req, res) => {
  res.status(200).render("shipping", { title: "Shipping" });
};

exports.renderPaymentPage = (req, res) => {
  res.status(200).render("payment", { title: "Payment" });
};
exports.renderOrderSummaryPage = (req, res) => {
  res.status(200).render("order-summary", { title: "Order Summary" });
};

exports.renderOrderCompletePage = (req, res) => {
  res.status(200).render("order-complete", { title: "Order" });
};
