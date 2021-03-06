import * as admin from 'firebase-admin'

export enum NotificationType {
  Like = 'LIKE',
}

export default (
  db: admin.firestore.Firestore,
  notificationType: NotificationType
) => async (snap: admin.firestore.DocumentSnapshot) => {
  const notifications = db.collection('notifications')

  if (notificationType === NotificationType.Like) {
    const data = snap.data()

    if (!data) {
      return
    }

    const { postId, userId } = data

    const post = await db.collection('posts').doc(postId).get()

    const postData = post.data()

    if (!postData || postData.userId === userId) {
      return
    }

    const notification = await notifications
      .where('fromUserId', '==', userId)
      .where('postId', '==', postId)
      .where('type', '==', NotificationType.Like)
      .where('userId', '==', postData.userId)
      .get()

    if (!notification.empty) {
      return
    }

    await notifications.add({
      createdAt: new Date(),
      fromUserId: userId,
      postId,
      read: false,
      type: NotificationType.Like,
      userId: postData.userId,
    })
  }
}
