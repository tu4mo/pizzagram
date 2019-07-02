import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export default (db: admin.firestore.Firestore) => async (
  req: functions.Request,
  res: functions.Response
) => {
  const usersSnapshot = await db.collection("users").get();

  usersSnapshot.forEach(async userRef => {
    const postsSnapshot = await db
      .collection("posts")
      .where("userId", "==", userRef.data().id)
      .get();

    await db
      .collection("users")
      .doc(userRef.id)
      .update({ posts: postsSnapshot.size });

    console.log(`${userRef.id}: ${postsSnapshot.size}`);
  });

  res.send("OK");
};
