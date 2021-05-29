const express = require("express");

const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", viewController.renderIndex);

router.get(
  "/create-store",
  authController.limitToUsers,
  viewController.renderCreateStoreForm
);

router.get("/cart", viewController.renderCartPage);
router.get("/checkout", viewController.renderCheckoutPage);
router.get("/shipping", viewController.renderShippingPage);
router.get("/payment", viewController.renderPaymentPage);
router.get("/order-summary", viewController.renderOrderSummaryPage);
router.get("/order/complete", viewController.renderOrderCompletePage);

// router.use(authController.limitToStoreOwners);

router.get(
  "/:storeSlug/dashboard",
  // authController.limitToStoreOwners,
  viewController.renderDashboard
);

router.get(
  "/:storeSlug/dashboard/products/add",
  // authController.limitToStoreOwners,
  viewController.renderProductForm
);

router.get(
  "/:storeSlug/dashboard/products",
  // authController.limitToStoreOwners,
  viewController.renderProductsDashboard
);

router.get(
  "/:storeSlug/products/:productSlug",
  viewController.renderProductDetail
);
router.get("/:storeSlug", viewController.renderStoreDetail);

module.exports = router;
