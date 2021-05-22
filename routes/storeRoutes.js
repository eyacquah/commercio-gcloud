const express = require("express");

const storeController = require("../controllers/storeController");

const router = express.Router();

router
  .route("/")
  .get(storeController.getAllStores)
  .post(
    storeController.uploadImage,
    storeController.resizeImage,
    storeController.createStore
  );

module.exports = router;
