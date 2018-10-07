const functions = require("firebase-functions");

const resizeImage = require("./resize-image");
const removePost = require("./remove-post");

exports.removePost = functions.firestore
  .document("posts/{postId}")
  .onDelete(removePost);

exports.generateResizedImages = functions.storage
  .object()
  .onFinalize(object =>
    Promise.all([128, 1024].map(size => resizeImage(object, size)))
  );
