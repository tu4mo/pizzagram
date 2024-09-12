import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
})

const db = admin.firestore()

const posts = await db.collection('posts').get()

for (const post of posts.docs) {
  const snapshot = await db
    .collection('comments')
    .where('postId', '==', post.id)
    .count()
    .get()

  const commentsCount = snapshot.data().count

  await db.collection('posts').doc(post.id).update({ commentsCount })

  console.log(`Updated ${post.id} with commentsCount: ${commentsCount}`)
}
