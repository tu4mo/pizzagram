import type * as admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

type Comment = {
  id: string
}

export async function removeCommentFromPost(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: admin.firestore.Firestore,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const comment = snap.data()
  const commentId = snap.id
  const post = await db.collection('posts').doc(comment.postId).get()

  console.log(`Removing comment ${commentId} from post ${post.id}`)

  if (!post.exists) {
    console.log('Post does not exist')
    return
  }

  const postComments = (post.get('comments') ?? []) as Comment[]
  const postComment = postComments.find(
    (postComment) => postComment.id === commentId,
  )

  if (!postComment) {
    console.log('No comment to remove from post')
    return
  }

  await db
    .collection('posts')
    .doc(post.id)
    .update({ comments: FieldValue.arrayRemove(postComment) })

  console.log(`Comment removed`)
}
