exports.renderIndex = (req, res, next) => {
  res.status(200).render("index");
};

exports.renderDashboard = (req, res) => {
  res.status(200).render("dashboard");
};

exports.renderCreateStoreForm = (req, res) =>
  res.status(200).render("create-store");

exports.renderProductForm = (req, res) => res.status(200).render("add-product");

exports.renderProducts = (req, res) => res.status(200).render("products");
