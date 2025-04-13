import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/firestore'

import { comments, db, likes, notifications } from './db.js'
import { bucket } from './storage.js'
import { generateUserFeed } from './utils/generate-user-feed.js'
import { updatePostsCount } from './utils/update-posts-count.js'

export async function deletePost(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const { id } = snap
  const { imageUrl, thumbnailUrl, userId } = snap.data()

  const imagePath = /posts%2F(.*)\?/.exec(imageUrl)?.at(1) ?? ''
  const imageFile = bucket.file(`posts/${imagePath}`)

  const thumbnailPath = /posts%2F(.*)\?/.exec(thumbnailUrl)?.at(1) ?? ''
  const thumbnailFile = bucket.file(`posts/${thumbnailPath}`)

  try {
    console.log(`Removing image ${imageFile.name}...`)
    await imageFile.delete()
  } catch {
    console.error(`Failed to remove image.`)
  }

  try {
    console.log(`Removing thumbnail ${thumbnailFile.name}...`)
    await thumbnailFile.delete()
  } catch {
    console.error(`Failed to remove thumbnail.`)
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
    await generateUserFeed(userId)
  } catch (error) {
    console.error(`Failed to completely remove post (${error}).`)
  }
}
