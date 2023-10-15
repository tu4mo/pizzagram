import * as admin from 'firebase-admin'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

type Comment = {
  userId: string
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
  const post = await db.collection('posts').doc(comment.postId).get()
  const postComments = ((post.get('comments') || []) as Comment[]).filter(
    (postComment) => postComment.userId === comment.userId,
  )

  console.log(`Removing user ${comment.userId} comments from post ${post.id}`)

  if (!post.exists) {
    console.log('Post does not exist')
    return
  }

  if (postComments.length === 0) {
    console.log('No comments to remove from post')
    return
  }

  await db
    .collection('posts')
    .doc(post.id)
    .update({
      comments: admin.firestore.FieldValue.arrayRemove(postComments),
    })

  console.log(`Comments removed`)
}
