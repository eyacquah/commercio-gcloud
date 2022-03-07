const path = require("path");
const Cloud = require("@google-cloud/storage");
const serviceKey = path.join(__dirname, "./storageKeys.json");

const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "commercio-343420",
});

module.exports = storage;
