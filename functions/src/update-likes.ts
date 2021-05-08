import * as admin from 'firebase-admin'

export const updateLikes = async (
  snapshot: admin.firestore.QueryDocumentSnapshot,
  db: admin.firestore.Firestore
) => {
  const like = snapshot.data()

  const post = await db.collection('posts').doc(like.postId).get()

  if (post.exists) {
    const likes = post.data()?.likes + 1 || 1
    await db.collection('posts').doc(post.id).update({ likes })
    console.log(`Increased ${post.id}'s likes count to ${likes}`)
  }
}
