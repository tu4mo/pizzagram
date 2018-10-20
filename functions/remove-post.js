/* eslint no-console: "off" */

const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

module.exports = db => async snap => {
  const id = snap.id;
  const { userId } = snap.data();

  const bucket = storage.bucket("pizzagram-cc.appspot.com");
  const photoFile = bucket.file(`posts/${id}.jpg`);
  const thumbnailFile = bucket.file(`posts/${id}_128.jpg`);

  const usersCollection = db.collection("users");

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

    const usersSnapshot = await usersCollection
      .where("id", "==", userId)
      .limit(1)
      .get();

    usersSnapshot.forEach(async userRef => {
      const posts = userRef.data().posts - 1;
      await usersCollection.doc(userRef.id).update({ posts });
      console.log(`Decreasing ${userRef.id}'s posts count to ${posts}`);
    });
  } catch (error) {
    console.log(`Failed to completely remove post (${error}).`);
  }
};
