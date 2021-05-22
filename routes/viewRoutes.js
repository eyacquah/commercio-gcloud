const express = require("express");

const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/", viewController.renderIndex);
router.get("/create-store", viewController.renderCreateStoreForm);
router.get("/add-product", viewController.renderProductForm);
router.get("/products", viewController.renderProducts);

router.get(":storeSlug/dashboard", viewController.renderDashboard);

module.exports = router;
