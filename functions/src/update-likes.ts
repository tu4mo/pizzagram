import * as admin from 'firebase-admin'

export const updateLikes = async (
  snapshot: admin.firestore.QueryDocumentSnapshot,
  db: admin.firestore.Firestore,
  add: boolean
) => {
  const like = snapshot.data()

  const post = await db.collection('posts').doc(like.postId).get()

  if (post.exists) {
    const currentLikes = post.data()?.likes || 0
    const likes = add ? currentLikes + 1 : Math.abs(currentLikes - 1)
    await db.collection('posts').doc(post.id).update({ likes })
    console.log(`Set ${post.id}'s likes count from ${currentLikes} to ${likes}`)
  }
}
