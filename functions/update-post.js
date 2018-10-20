/* eslint no-console: "off" */

module.exports = db => async change => {
  const { userId } = change.after.data();

  const usersSnapshot = await db
    .collection("users")
    .where("id", "==", userId)
    .limit(1)
    .get();

  usersSnapshot.forEach(async doc => {
    const posts = doc.data().posts + 1 || 1;

    console.log(`Increasing ${doc.id}'s posts count to ${posts}`);

    await db
      .collection("users")
      .doc(doc.id)
      .update({ posts });
  });
};
