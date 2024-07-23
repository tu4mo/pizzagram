import * as functionsV1 from 'firebase-functions'
import * as functionsV2 from 'firebase-functions/v2'

import { addNotification, NotificationType } from './add-notification'
import { deletePost } from './delete-post'
import { deleteUser } from './delete-user'
import { generateUserFeed } from './generate-user-feed'
import { registerUser } from './register-user'
import { resizeImage } from './resize-image'
import { updateCommentsCountInPost } from './update-comments-count-in-post'
import { updatePostsCount } from './update-posts-count'
import { verifyImage } from './verify-image'

exports.deletePost = functionsV2.firestore.onDocumentDeleted(
  'posts/{postId}',
  async (snapshot) => {
    const { userId } = snapshot.data?.data() ?? {}
    if (typeof userId === 'string') {
      await deletePost(snapshot)
      await generateUserFeed(userId)
    }
    return
  },
)

exports.createPost = functionsV2.firestore.onDocumentCreated(
  'posts/{postId}',
  (snapshot) => {
    const { userId } = snapshot.data?.data() ?? {}
    if (typeof userId === 'string') {
      return Promise.all([updatePostsCount(userId), generateUserFeed(userId)])
    }
    return
  },
)

exports.createComment = functionsV2.firestore.onDocumentCreated(
  'comments/{commentId}',
  (snapshot) =>
    Promise.all([
      updateCommentsCountInPost(snapshot, 1),
      addNotification(snapshot, NotificationType.Comment),
    ]),
)

exports.deleteComment = functionsV2.firestore.onDocumentDeleted(
  'comments/{commentId}',
  (snapshot) => updateCommentsCountInPost(snapshot, -1),
)

exports.createLike = functionsV2.firestore.onDocumentCreated(
  'likes/{likeId}',
  (snapshot) => addNotification(snapshot, NotificationType.Like),
)

exports.registerUser = functionsV2.https.onCall(
  { enforceAppCheck: true },
  registerUser,
)

exports.deleteUser = functionsV1.auth.user().onDelete(deleteUser)

exports.generateResizedImages = functionsV2.storage.onObjectFinalized(
  { memory: '1GiB' },
  (event) => Promise.all([resizeImage(event, true), resizeImage(event, false)]),
)

exports.verifyImage = functionsV2.https.onCall(
  { enforceAppCheck: true, memory: '1GiB' },
  verifyImage,
)
