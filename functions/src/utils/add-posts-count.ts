import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export default (db: admin.firestore.Firestore) => async (
  req: functions.Request,
  res: functions.Response
) => {
  const usersSnapshot = await db.collection('users').get()

  usersSnapshot.forEach(async (userRef) => {
    await updateUserPostsCount(db, userRef.id)
  })

  res.send('OK')
}

export const updateUserPostsCount = async (
  db: admin.firestore.Firestore,
  userId: string
) => {
  const postsSnapshot = await db
    .collection('posts')
    .where('userId', '==', userId)
    .get()

  const usersSnapshot = await db
    .collection('users')
    .where('id', '==', userId)
    .limit(1)
    .get()

  usersSnapshot.forEach(async (user) => {
    await db
      .collection('users')
      .doc(user.id)
      .update({ posts: postsSnapshot.size })

    console.log(`Updated ${user.id}'s posts count: ${postsSnapshot.size}.`)
  })
}
