import * as functionsV1 from 'firebase-functions/v1'
import * as functionsV2 from 'firebase-functions/v2'

import { addNotification, NotificationType } from './add-notification'
import { deletePost } from './delete-post'
import { deleteUser } from './delete-user'
import { registerUser } from './register-user'
import { sharePost } from './share-post'
import { updateCommentsCount } from './update-comments-count'

exports.deletePost = functionsV2.firestore.onDocumentDeleted(
  'posts/{postId}',
  deletePost,
)

exports.createComment = functionsV2.firestore.onDocumentCreated(
  'comments/{commentId}',
  async (event) => {
    const { postId } = event.data?.data() ?? {}
    await Promise.all([
      updateCommentsCount(postId),
      addNotification(event, NotificationType.Comment),
    ])
  },
)

exports.deleteComment = functionsV2.firestore.onDocumentDeleted(
  'comments/{commentId}',
  async (event) => {
    const { postId } = event.data?.data() ?? {}
    if (typeof postId === 'string') {
      await updateCommentsCount(postId)
    }
  },
)

exports.createLike = functionsV2.firestore.onDocumentCreated(
  'likes/{likeId}',
  (event) => addNotification(event, NotificationType.Like),
)

exports.registerUser = functionsV2.https.onCall(
  { enforceAppCheck: true },
  registerUser,
)

exports.deleteUser = functionsV1.auth.user().onDelete(deleteUser)

exports.sharePost = functionsV2.https.onCall(
  { enforceAppCheck: true, memory: '1GiB' },
  sharePost,
)
