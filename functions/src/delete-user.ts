import * as admin from 'firebase-admin'
import { Filter } from 'firebase-admin/firestore'
import type * as functionsV1 from 'firebase-functions/v1'

import {
  comments,
  db,
  feeds,
  likes,
  notifications,
  posts,
  users,
} from './db.js'

export async function deleteUser(user: functionsV1.auth.UserRecord) {
  const { uid, email } = user
  const deleteBatch = db.batch()

  console.group(`Deleting ${email} (${uid})...`)

  const commentsData = await comments.where('userId', '==', uid).get()
  commentsData.forEach((doc) => {
    console.log('Deleting comment', doc.id)
    deleteBatch.delete(comments.doc(doc.id))
  })

  const likesData = await likes.where('userId', '==', uid).get()
  likesData.forEach((doc) => {
    console.log('Deleting like', doc.id)
    deleteBatch.delete(likes.doc(doc.id))
  })

  const postsWithLikes = await posts.where(`likes.${uid}`, '==', true).get()
  postsWithLikes.forEach((doc) => {
    console.log('Deleting like from post', doc.id)
    deleteBatch.update(posts.doc(doc.id), {
      [`likes.${uid}`]: admin.firestore.FieldValue.delete(),
    })
  })

  const notificationsData = await notifications
    .where(
      Filter.or(
        Filter.where('userId', '==', uid),
        Filter.where('fromUserId', '==', uid),
      ),
    )
    .get()
  notificationsData.forEach((doc) => {
    console.log('Deleting notification', doc.id)
    deleteBatch.delete(notifications.doc(doc.id))
  })

  const postsData = await posts.where('userId', '==', uid).get()
  postsData.forEach((doc) => {
    console.log('Deleting post', doc.id)
    deleteBatch.delete(posts.doc(doc.id))
  })

  console.log('Deleting feed', uid)
  deleteBatch.delete(feeds.doc(uid))

  console.log('Deleting user', uid)
  deleteBatch.delete(users.doc(uid))

  await deleteBatch.commit()

  console.log(
    `Deleted ${commentsData.size} comments,`,
    `${likesData.size} likes,`,
    `${postsWithLikes.size} likes from posts,`,
    `${notificationsData.size} notifications,`,
    `${postsData.size} posts.`,
  )
  console.groupEnd()
}
