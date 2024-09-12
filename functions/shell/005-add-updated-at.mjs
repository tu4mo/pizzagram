import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const posts = await db.collection('posts').get()

for (const post of posts.docs) {
  const createdAt = post.data().createdAt

  await db.collection('posts').doc(post.id).update({ updatedAt: createdAt })

  console.log(`Updated ${post.id} updatedAt to ${createdAt}`)
}
