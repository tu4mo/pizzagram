import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const db = admin.firestore()

const usersSnapshot = await db.collection('users').get()

usersSnapshot.forEach(async (userRef) => {
  const user = userRef.data()

  await db
    .collection('users_2')
    .doc(user.id)
    .set({
      createdAt: user.createdAt,
      gravatar: user.gravatar ?? '',
      posts: user.posts ?? 0,
      username: userRef.id,
      id: user.id,
    })

  console.log(userRef.id)
})
