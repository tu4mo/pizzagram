/* eslint no-console: "off" */

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

module.exports = async snap => {
  const id = snap.id;

  const bucket = storage.bucket("pizzagram-cc.appspot.com");
  const photoFile = bucket.file(`posts/${id}.jpg`);
  const thumbnailFile = bucket.file(`posts/${id}_128.jpg`);

  try {
    await photoFile.delete();
    await thumbnailFile.delete();

    console.log(`${photoFile.name} and ${thumbnailFile.name} removed.`);

    const likesCollection = db.collection("likes");
    const querySnapshot = await likesCollection.where("postId", "==", id).get();

    let deletePostPromises = [];

    querySnapshot.forEach(doc => {
      deletePostPromises.push(likesCollection.doc(doc.id).delete());
    });

    await Promise.all(deletePostPromises);

    console.log(`Removed ${deletePostPromises.length} likes.`);
  } catch (error) {
    console.log(`Failed to completely remove post (${error}).`);
  }
};
