import * as admin from "firebase-admin";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

export default (db: admin.firestore.Firestore) => async (
  snap: admin.firestore.DocumentSnapshot
) => {
  const { id } = snap;
  const postData = snap.data();

  if (!postData) {
    return;
  }

  const { userId } = postData;

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
    const deleteLikesBatch = db.batch();

    querySnapshot.forEach(doc => {
      deleteLikesBatch.delete(likesCollection.doc(doc.id));
    });

    await deleteLikesBatch.commit();

    console.log(`Removed ${querySnapshot.size} likes.`);

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
