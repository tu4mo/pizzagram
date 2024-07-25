import { FieldValue } from 'firebase-admin/firestore'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

import { comments, posts } from './db'

export async function updateCommentsCount(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
) {
  const snapshot = event.data

  if (!snapshot) {
    return
  }

  const commentData = snapshot.data()
  const postDoc = posts.doc(commentData.postId)
  const post = await postDoc.get()
  const postData = post.data()

  if (!postData) {
    return
  }

  const documentData = await comments
    .where('postId', '==', post.id)
    .count()
    .get()

  const commentsCount = documentData.data().count

  await postDoc.update({
    commentsCount,
    updatedAt: FieldValue.serverTimestamp(),
  })

  console.log(`Updated posts ${post.id} comments count to ${commentsCount}`)
}
