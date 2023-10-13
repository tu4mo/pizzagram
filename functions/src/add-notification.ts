import type * as admin from 'firebase-admin'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

export enum NotificationType {
  Like = 'LIKE',
}

export async function addNotification(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: admin.firestore.Firestore,
  notificationType: NotificationType,
) {
  const snap = event.data

  if (!snap) {
    return
  }

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
      imageUrl: postData.imageUrl,
      postId,
      read: false,
      type: NotificationType.Like,
      userId: postData.userId,
    })

    console.log('Notification added')
  }
}
