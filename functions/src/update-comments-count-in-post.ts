import { FieldValue } from 'firebase-admin/firestore'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

import { posts } from './db'

export async function updateCommentsCountInPost(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  increment: number,
) {
  const snapshot = event.data

  if (!snapshot) {
    return
  }

  const commentData = snapshot.data()
  const postDoc = posts.doc(commentData.postId)
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
    commentsCount: FieldValue.increment(increment),
  })
}
