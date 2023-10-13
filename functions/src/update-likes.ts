import * as admin from 'firebase-admin'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

export async function updateLikes(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: admin.firestore.Firestore,
  add: boolean,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const like = snap.data()
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
