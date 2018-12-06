/* eslint no-console: "off" */

module.exports = db => async (req, res) => {
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
