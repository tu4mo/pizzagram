const admin = require("firebase-admin");
const functions = require("firebase-functions");

const addPostsCount = require("./utils/add-posts-count");
const generateThumbnail = require("./utils/generate-thumbnail");

const addNotification = require("./add-notification");
const resizeImage = require("./resize-image");
const removePost = require("./remove-post");
const updatePost = require("./update-post");

admin.initializeApp();

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

exports.removePost = functions.firestore
  .document("posts/{postId}")
  .onDelete(removePost(db));

exports.updatePost = functions.firestore
  .document("posts/{postId}")
  .onUpdate(updatePost(db));

exports.addLikeNotification = functions.firestore
  .document("likes/{likeId}")
  .onCreate(addNotification(db, "LIKE"));

exports.generateResizedImages = functions.storage
  .object()
  .onFinalize(object =>
    Promise.all([128, 1024].map(size => resizeImage(object, size)))
  );

exports.addPostsCount = functions.https.onRequest(addPostsCount(db));

exports.generateThumbnail = functions.https.onRequest(() => {
  return [128, 1024].map(generateThumbnail);
});
