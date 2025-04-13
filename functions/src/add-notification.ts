import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/firestore'

import { notifications, posts } from './db.js'

export type NotificationType = 'COMMENT' | 'LIKE'

export async function addNotification(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  notificationType: NotificationType,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const { postId, userId } = snap.data()
  const post = await posts.doc(postId).get()
  const postData = post.data()

  if (
    !postData ||
    // If the post was created by the user, don't send a notification
    postData.userId === userId
  ) {
    return
  }

  // Don't send multiple like notifications for the same post
  if (notificationType === 'LIKE') {
    const notification = await notifications
      .where('fromUserId', '==', userId)
      .where('postId', '==', postId)
      .where('type', '==', notificationType)
      .where('userId', '==', postData.userId)
      .count()
      .get()

    if (notification.data().count > 0) {
      return
    }
  }

  const notification = await notifications.add({
    createdAt: new Date(),
    fromUserId: userId,
    imageUrl: postData.thumbnailUrl,
    postId,
    read: false,
    type: notificationType,
    userId: postData.userId,
  })

  console.log(`Notification ${notification.id} added.`)
}
