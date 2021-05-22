const multer = require("multer");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Store = require("../models/storeModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { uploadToGCP } = require("../utils/uploadImage");

// FACTORY CRUD

exports.createStore = factory.createOne(Store);
exports.getAllStores = factory.getAll(Store);
exports.getStore = factory.getOne(Store);
exports.deleteStore = factory.deleteOne(Store);

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

exports.uploadImage = upload.single("image");

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const { file } = req;

  const filename = `logo-${Math.random() * 1000}-${Date.now()}.png`;

  const resizedImage = await sharp(file.buffer)
    .resize(200, 200)
    .png()
    .toBuffer();

  const imageUrl = await uploadToGCP({ filename, buffer: resizedImage });
  req.body.image = imageUrl;
  console.log(imageUrl);

  // res.status(200).json({ status: "success", data: req.body });
  // return;
  next();
});
