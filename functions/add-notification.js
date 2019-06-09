const NOTIFICATION_TYPE_LIKE = "LIKE";

module.exports = (db, notificationType) => async snap => {
  if (notificationType === NOTIFICATION_TYPE_LIKE) {
    const { postId } = snap.data();

    const post = await db
      .collection("posts")
      .doc(postId)
      .get();

    await db.collection("notifications").add({
      createdAt: new Date(),
      postId,
      read: false,
      type: NOTIFICATION_TYPE_LIKE,
      userId: post.data().userId
    });
  }
};
