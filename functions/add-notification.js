const NOTIFICATION_TYPE_LIKE = "LIKE";

module.exports = (db, notificationType) => async snap => {
  if (notificationType === NOTIFICATION_TYPE_LIKE) {
    const { postId, userId } = snap.data();

    const post = await db
      .collection("posts")
      .doc(postId)
      .get();

    await db.collection("notifications").add({
      createdAt: new Date(),
      fromUserId: userId,
      postId,
      read: false,
      userId: post.data().userId,
      type: NOTIFICATION_TYPE_LIKE
    });
  }
};
