import type * as admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

export async function addComment(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: admin.firestore.Firestore,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  console.log(`Adding "createdAt" to comment ${snap.id}`)

  db.collection('comments').doc(snap.id).update({ createdAt: snap.createTime })

  const commentData = snap.data()
  const post = await db.collection('posts').doc(commentData.postId).get()
  const postData = post.data()

  if (!postData) {
    return
  }

  console.log(`Updating comments on post ${commentData.postId}`)

  const postDoc = db.collection('posts').doc(commentData.postId)
  await postDoc.update({
    comments: FieldValue.arrayUnion({
      [commentData.userId]: commentData.comment,
    }),
  })
}
