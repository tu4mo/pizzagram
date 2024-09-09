import * as functionsV1 from 'firebase-functions'
import * as functionsV2 from 'firebase-functions/v2'

import { addNotification, NotificationType } from './add-notification'
import { deletePost } from './delete-post'
import { deleteUser } from './delete-user'
import { generateUserFeed } from './generate-user-feed'
import { registerUser } from './register-user'
import { resizeImage } from './resize-image'
import { sharePost } from './share-post'
import { updateCommentsCount } from './update-comments-count'
import { updatePostsCount } from './update-posts-count'

exports.deletePost = functionsV2.firestore.onDocumentDeleted(
  'posts/{postId}',
  async (event) => {
    const { userId } = event.data?.data() ?? {}
    if (typeof userId === 'string') {
      await deletePost(event)
      await generateUserFeed(userId)
    }
    return
  },
)

exports.createPost = functionsV2.firestore.onDocumentCreated(
  'posts/{postId}',
  (event) => {
    const { userId } = event.data?.data() ?? {}
    if (typeof userId === 'string') {
      return Promise.all([updatePostsCount(userId), generateUserFeed(userId)])
    }
    return
  },
)

exports.createComment = functionsV2.firestore.onDocumentCreated(
  'comments/{commentId}',
  (event) =>
    Promise.all([
      updateCommentsCount(event),
      addNotification(event, NotificationType.Comment),
    ]),
)

exports.deleteComment = functionsV2.firestore.onDocumentDeleted(
  'comments/{commentId}',
  (event) => updateCommentsCount(event),
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

exports.generateResizedImages = functionsV2.storage.onObjectFinalized(
  { memory: '1GiB' },
  resizeImage,
)

exports.sharePost = functionsV2.https.onCall(
  { enforceAppCheck: true, memory: '1GiB' },
  sharePost,
)
