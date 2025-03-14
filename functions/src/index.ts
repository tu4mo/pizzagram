import { firestore, https } from 'firebase-functions'
import { auth } from 'firebase-functions/v1'

import { addNotification, NotificationType } from './add-notification'
import { deletePost } from './delete-post'
import { deleteUser } from './delete-user'
import { registerUser } from './register-user'
import { sharePost } from './share-post'
import { updateCommentsCount } from './update-comments-count'

exports.deletePost = firestore.onDocumentDeleted('posts/{postId}', deletePost)

exports.createComment = firestore.onDocumentCreated(
  'comments/{commentId}',
  async (event) => {
    const { postId } = event.data?.data() ?? {}
    await Promise.all([
      updateCommentsCount(postId),
      addNotification(event, NotificationType.Comment),
    ])
  },
)

exports.deleteComment = firestore.onDocumentDeleted(
  'comments/{commentId}',
  async (event) => {
    const { postId } = event.data?.data() ?? {}
    if (typeof postId === 'string') {
      await updateCommentsCount(postId)
    }
  },
)

exports.createLike = firestore.onDocumentCreated('likes/{likeId}', (event) =>
  addNotification(event, NotificationType.Like),
)

exports.registerUser = https.onCall({ enforceAppCheck: true }, registerUser)

exports.deleteUser = auth.user().onDelete(deleteUser)

exports.sharePost = https.onCall(
  { enforceAppCheck: true, memory: '1GiB' },
  sharePost,
)
