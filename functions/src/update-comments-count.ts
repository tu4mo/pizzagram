import { FieldValue } from 'firebase-admin/firestore'

import { comments, posts } from './db.js'

export async function updateCommentsCount(postId: string) {
  const postDoc = posts.doc(postId)
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
