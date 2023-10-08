import * as admin from 'firebase-admin'

export async function updateLikes(
  snapshot: admin.firestore.QueryDocumentSnapshot,
  db: admin.firestore.Firestore,
  add: boolean,
) {
  const like = snapshot.data()
  const post = await db.collection('posts').doc(like.postId).get()

  if (!post.exists) {
    return
  }

  if (add) {
    await db
      .collection('posts')
      .doc(post.id)
      .update({ likes: admin.firestore.FieldValue.arrayUnion(like.userId) })

    console.log(`Added ${like.userId} to ${post.id} likes`)
  } else {
    await db
      .collection('posts')
      .doc(post.id)
      .update({ likes: admin.firestore.FieldValue.arrayRemove(like.userId) })

    console.log(`Removed ${like.userId} from ${post.id} likes`)
  }
}
