import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

import { comments, db, likes, notifications } from './db'
import { bucket } from './storage'
import { updatePostsCount } from './update-posts-count'

export async function deletePost(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const { id } = snap
  const { userId } = snap.data()

  const photoFile = bucket.file(`posts/${id}.jpg`)
  const thumbnailFile = bucket.file(`posts/${id}_t.jpg`)

  try {
    await photoFile.delete()
    await thumbnailFile.delete()

    console.log(`${photoFile.name} and ${thumbnailFile.name} removed.`)

    const deleteBatch = db.batch()

    const commentsSnapshot = await comments.where('postId', '==', id).get()
    commentsSnapshot.forEach((doc) => {
      deleteBatch.delete(comments.doc(doc.id))
    })

    const likesSnapshot = await likes.where('postId', '==', id).get()
    likesSnapshot.forEach((doc) => {
      deleteBatch.delete(likes.doc(doc.id))
    })

    const notificationsSnapshot = await likes.where('postId', '==', id).get()
    notificationsSnapshot.forEach((doc) => {
      deleteBatch.delete(notifications.doc(doc.id))
    })

    await deleteBatch.commit()

    console.log(
      `Removed ${commentsSnapshot.size} comments, ${likesSnapshot.size} likes and ${notificationsSnapshot.size} notifications.`,
    )

    await updatePostsCount(userId)
  } catch (error) {
    console.log(`Failed to completely remove post (${error}).`)
  }
}
