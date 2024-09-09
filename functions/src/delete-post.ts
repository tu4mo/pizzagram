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
  const { imageUrl, userId } = snap.data()

  const imagePath = /posts%2F(.*)\?/.exec(imageUrl)?.at(1) ?? ''
  const [filename, extension] = imagePath.split('.')

  const photoFile = bucket.file(`posts/${imagePath}`)
  const thumbnailFile = bucket.file(`posts/${filename}_t.${extension}`)

  try {
    console.log(`Removing image ${photoFile.name}...`)
    await photoFile.delete()
  } catch {
    console.error(`Failed to remove image.`)
  }

  try {
    console.log(`Removing thumbnail ${thumbnailFile.name}...`)
    await thumbnailFile.delete()
  } catch {
    console.error(`Failed to remove image.`)
  }

  try {
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
    console.error(`Failed to completely remove post (${error}).`)
  }
}
