import * as admin from 'firebase-admin'

export const updateLikes = async (
  snapshot: admin.firestore.QueryDocumentSnapshot,
  db: admin.firestore.Firestore
) => {
  const like = snapshot.data()

  const usersSnapshot = await db
    .collection('posts')
    .where('id', '==', like.postId)
    .limit(1)
    .get()

  usersSnapshot.forEach(async (doc) => {
    const likes = doc.data().likes + 1 || 1

    console.log(`Increasing ${doc.id}'s likes count to ${likes}`)

    await db.collection('posts').doc(doc.id).update({ likes })
  })
}
