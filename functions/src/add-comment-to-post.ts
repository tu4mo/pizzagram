import type * as admin from 'firebase-admin'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

export async function addCommentToPost(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: admin.firestore.Firestore,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const commentData = snap.data()

  const userDoc = await db.collection('users_2').doc(commentData.userId).get()
  const username = userDoc.data()?.username

  if (!username) {
    return
  }

  console.log(`Adding username to comment ${snap.id}`)

  await db.collection('comments').doc(snap.id).update({ username })

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
        createdAt: commentData.createdAt,
        id: snap.id,
        userId: commentData.userId,
        username,
      },
    ],
  })
}
