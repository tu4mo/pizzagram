import { firestore, https } from 'firebase-functions'
import { auth } from 'firebase-functions/v1'

import { addNotification } from './add-notification.js'
import { deletePost } from './delete-post.js'
import { deleteUser } from './delete-user.js'
import { registerUser } from './register-user.js'
import { sharePost } from './share-post.js'
import { updateCommentsCount } from './update-comments-count.js'

export const onPostDeleted = firestore.onDocumentDeleted(
  'posts/{postId}',
  deletePost,
)

export const onCommentCreated = firestore.onDocumentCreated(
  'comments/{commentId}',
  async (event) => {
    const { postId } = event.data?.data() ?? {}
    await Promise.all([
      updateCommentsCount(postId),
      addNotification(event, 'COMMENT'),
    ])
  },
)

export const onCommentDeleted = firestore.onDocumentDeleted(
  'comments/{commentId}',
  async (event) => {
    const { postId } = event.data?.data() ?? {}
    if (typeof postId === 'string') {
      await updateCommentsCount(postId)
    }
  },
)

export const onLikeCreated = firestore.onDocumentCreated(
  'likes/{likeId}',
  (event) => addNotification(event, 'LIKE'),
)

export const onRegisterUserCall = https.onCall(
  { enforceAppCheck: true },
  registerUser,
)

export const onDeleteUser = auth.user().onDelete(deleteUser)

export const onSahrePostCall = https.onCall(
  { enforceAppCheck: true, memory: '1GiB' },
  sharePost,
)
