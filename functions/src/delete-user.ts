import { Storage } from '@google-cloud/storage'
import * as admin from 'firebase-admin'
const storage = new Storage()
const bucket = storage.bucket('gs://pizzagram-cc.appspot.com')

export async function deleteUser(
  user: admin.auth.UserRecord,
  db: admin.firestore.Firestore,
) {
  const { uid, email } = user
  const deleteBatch = db.batch()

  console.log(`Removing ${email} (${uid})...`)

  const postsCollection = db.collection('posts')

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

  // Remove likes from posts
  const postsWithLikes = await postsCollection
    .where(`likes.${uid}`, '==', true)
    .get()
  postsWithLikes.forEach((doc) => {
    deleteBatch.update(postsCollection.doc(doc.id), {
      [`likes.${uid}`]: admin.firestore.FieldValue.delete(),
    })
  })

  // Remove notifications to user
  const notificationsCollection = db.collection('notifications')
  const notificationsToUser = await notificationsCollection
    .where('userId', '==', uid)
    .get()
  notificationsToUser.forEach((doc) => {
    deleteBatch.delete(notificationsCollection.doc(doc.id))
  })
  const notificationsFromUser = await notificationsCollection
    .where('fromUserId', '==', uid)
    .get()
  notificationsFromUser.forEach((doc) => {
    deleteBatch.delete(notificationsCollection.doc(doc.id))
  })

  // Remove posts
  const posts = await postsCollection.where('userId', '==', uid).get()

  const files: Promise<any>[] = []
  posts.forEach((doc) => {
    deleteBatch.delete(postsCollection.doc(doc.id))
    files.push(bucket.file(`posts/${doc.id}.jpg`).delete())
    files.push(bucket.file(`posts/${doc.id}_t.jpg`).delete())
  })

  await Promise.all(files)

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
      `${
        notificationsToUser.size + notificationsFromUser.size
      } notifications, ` +
      `${posts.size} posts.`,
  )
}
