import * as admin from 'firebase-admin'

import { comments, db, feeds, likes, notifications, posts, users } from './db'

export async function deleteUser(user: admin.auth.UserRecord) {
  const { uid, email } = user
  const deleteBatch = db.batch()

  console.log(`Removing ${email} (${uid})...`)

  // Remove comments
  const commentsData = await comments.where('userId', '==', uid).get()
  commentsData.forEach((doc) => {
    deleteBatch.delete(comments.doc(doc.id))
  })

  // Remove likes
  const likesData = await likes.where('userId', '==', uid).get()
  likesData.forEach((doc) => {
    deleteBatch.delete(likes.doc(doc.id))
  })

  // Remove likes from posts
  const postsWithLikes = await posts.where(`likes.${uid}`, '==', true).get()
  postsWithLikes.forEach((doc) => {
    deleteBatch.update(posts.doc(doc.id), {
      [`likes.${uid}`]: admin.firestore.FieldValue.delete(),
    })
  })

  // Remove notifications to user
  const notificationsToUser = await notifications
    .where('userId', '==', uid)
    .get()
  notificationsToUser.forEach((doc) => {
    deleteBatch.delete(notifications.doc(doc.id))
  })
  const notificationsFromUser = await notifications
    .where('fromUserId', '==', uid)
    .get()
  notificationsFromUser.forEach((doc) => {
    deleteBatch.delete(notifications.doc(doc.id))
  })

  // Remove posts
  const postsData = await posts.where('userId', '==', uid).get()
  postsData.forEach((doc) => {
    deleteBatch.delete(posts.doc(doc.id))
  })

  // Remove feed
  deleteBatch.delete(feeds.doc(uid))

  // Remove user
  deleteBatch.delete(users.doc(uid))

  await deleteBatch.commit()

  console.log(
    `Removed ${commentsData.size} comments, ` +
      `${likesData.size} likes, ` +
      `${
        notificationsToUser.size + notificationsFromUser.size
      } notifications, ` +
      `${postsData.size} posts.`,
  )
  console.log(`Removed feed ${uid}.`)
  console.log(`Removed user ${uid}.`)
}
