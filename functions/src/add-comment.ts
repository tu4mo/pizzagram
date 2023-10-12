import type * as admin from 'firebase-admin'
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
  const postDoc = db.collection('posts').doc(commentData.postId)
  const post = await postDoc.get()
  const postData = post.data()

  if (!postData) {
    return
  }

  console.log(`Updating comments on post ${commentData.postId}`)

  const lastThreeComments = (postData.comments ?? []).slice(-2)
  await postDoc.update({
    comments: [
      ...lastThreeComments,
      {
        comment: commentData.comment,
        id: snap.id,
        userId: commentData.userId,
        username: commentData.username,
      },
    ],
  })
}
