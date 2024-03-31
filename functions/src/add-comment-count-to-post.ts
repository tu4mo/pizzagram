import type * as admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

export async function addCommentCountToPost(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: admin.firestore.Firestore,
) {
  const snapshot = event.data

  if (!snapshot) {
    return
  }

  const commentData = snapshot.data()

  const userDoc = await db.collection('users_2').doc(commentData.userId).get()
  const username = userDoc.data()?.username ?? ''

  console.log(`Adding username to comment ${snapshot.id}`)

  await db.collection('comments').doc(snapshot.id).update({ username })

  const postDoc = db.collection('posts').doc(commentData.postId)
  const post = await postDoc.get()

  if (!post.exists) {
    return
  }

  const postData = post.data()

  if (!postData) {
    return
  }

  console.log(`Updating commentsCount on post ${post.id}`)

  await postDoc.update({
    commentsCount: FieldValue.increment(1),
  })
}
