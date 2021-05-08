const admin = require('firebase-admin')
const serviceAccount = require('./service-account-key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const addLikesCountToPosts = async () => {
  const posts = await db.collection('posts').get()

  for (const post of posts.docs) {
    const likes = await db
      .collection('likes')
      .where('postId', '==', post.id)
      .get()

    let userIds = []

    for (const doc of likes.docs) {
      userIds.push(doc.data().userId)
    }

    await db.collection('posts').doc(post.id).update({ likes: userIds })

    console.log(`Updated ${post.id} with ${userIds.length} likes`)
  }
}

addLikesCountToPosts()
