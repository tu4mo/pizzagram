import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const users = await db.collection('users_2').get()

for (const user of users.docs) {
  const userPosts = await db
    .collection('posts')
    .where('published', '==', true)
    .where('userId', '==', user.id)
    .orderBy('createdAt', 'desc')
    .get()

  const normalizedPosts = userPosts.docs.map((doc) => {
    const data = doc.data()

    const extension = /(\.[a-z]+)\?/i.exec(data.imageUrl)?.at(1)
    const imageUrl = data.imageUrl.replace(extension, `_t${extension}`)

    return {
      caption: data.caption,
      id: doc.id,
      imageUrl: data.thumbnailUrl || imageUrl,
    }
  })

  await db
    .collection('feeds')
    .doc(user.id)
    .set({ json: JSON.stringify(normalizedPosts) })

  console.log(`Updated ${user.id} with latest feed`)
}
