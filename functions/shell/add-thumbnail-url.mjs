import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const posts = await db.collection('posts').get()

for (const post of posts.docs) {
  const data = post.data()
  const extension = /(\.[a-z]+)\?/i.exec(data.imageUrl)?.at(1)
  const thumbnailUrl = data.imageUrl.replace(extension, `_t${extension}`)

  await db.collection('posts').doc(post.id).update({ thumbnailUrl })

  console.log(`Post ${post.id} updated`)
}
