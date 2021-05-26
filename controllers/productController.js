const multer = require("multer");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Product = require("../models/productModel");
const Store = require("../models/storeModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { uploadToGCP } = require("../utils/uploadImage");

exports.createProduct = factory.createOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

// //////////////////////////////////////////
//// IMAGE UPLOADS AND PROCESSING

const multerStorage = multer.memoryStorage();

// Filter for Valid File Types
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload an image", 400), false);
  }
};

// Handle Upload
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.array("images", 3);

// Resizing Uploaded Images
exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (req.files.length === 0) return next();

  // Store the images in the body
  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${Math.random() * 1000}-${Date.now()}-${
        i + 1
      }.jpeg`;

      const resizedImage = await sharp(file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

      const imageUrl = await uploadToGCP({ filename, buffer: resizedImage });
      req.body.images.push(imageUrl);
    })
  );

  next();
});

exports.increaseStoreProductCount = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ _id: req.body.store });

  if (!store)
    return next(new AppError("A product must belong to a store", 400));

  store.stats.numOfProducts += 1;
  await Store.findByIdAndUpdate(store._id, store);

  next();
});
