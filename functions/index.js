const functions = require("firebase-functions");

const resizeImage = require("./resize-image");

exports.generateResizedImages = functions.storage
  .object()
  .onFinalize(object =>
    Promise.all([128, 1024].map(size => resizeImage(object, size)))
  );
