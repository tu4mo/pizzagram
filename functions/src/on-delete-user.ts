import * as admin from 'firebase-admin'
import { Storage } from '@google-cloud/storage'
const storage = new Storage()
const bucket = storage.bucket('gs://pizzagram-cc.appspot.com')

export const onDeleteUser = async (
  user: admin.auth.UserRecord,
  db: admin.firestore.Firestore
) => {
  const { uid, email } = user
  const deleteBatch = db.batch()

  console.log(`Removing ${email} (${uid}) data...`)

  // Remove comments
  const commentsCollection = db.collection('comments')
  const comments = await commentsCollection.where('userId', '==', uid).get()
  comments.forEach((doc) => {
    deleteBatch.delete(commentsCollection.doc(doc.id))
  })

  // Remove likes
  const likesCollection = db.collection('likes')
  const likes = await likesCollection.where('userId', '==', uid).get()
  likes.forEach((doc) => {
    deleteBatch.delete(likesCollection.doc(doc.id))
  })

  // Remove notifications
  const notificationsCollection = db.collection('notifications')
  const notifications = await notificationsCollection
    .where('userId', '==', uid)
    .get()
  notifications.forEach((doc) => {
    deleteBatch.delete(notificationsCollection.doc(doc.id))
  })

  // Remove posts
  const postsCollection = db.collection('posts')
  const posts = await postsCollection.where('userId', '==', uid).get()

  const postsIds: string[] = []
  posts.forEach((doc) => {
    deleteBatch.delete(postsCollection.doc(doc.id))
    postsIds.push(doc.id)
  })

  for (const postId in postsIds) {
    await Promise.all([
      bucket.file(`posts/${postId}.jpg`).delete(),
      bucket.file(`posts/${postId}_t.jpg`).delete(),
    ])
    console.log(`Removed ${postId}.jpg and ${postId}_t.jpg.`)
  }

  // Remove user
  const usersCollection = db.collection('users')
  const users = await usersCollection.where('id', '==', uid).limit(1).get()
  users.forEach((doc) => {
    deleteBatch.delete(usersCollection.doc(doc.id))
    console.log(`Removed user ${doc.id}.`)
  })

  await deleteBatch.commit()

  console.log(
    `Removed ${comments.size} comments, ` +
      `${likes.size} likes, ` +
      `${notifications.size} notifications, ` +
      `${posts.size} posts.`
  )
}
