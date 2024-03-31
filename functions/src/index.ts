import * as functionsV1 from 'firebase-functions'
import * as functionsV2 from 'firebase-functions/v2'

import { addCommentCountToPost } from './add-comment-count-to-post'
import { addNotification, NotificationType } from './add-notification'
import { db } from './db'
import { deletePost } from './delete-post'
import { deleteUser } from './delete-user'
import { registerUser } from './register-user'
import { removeCommentFromPost } from './remove-comment-from-post'
import { resizeImage } from './resize-image'
import { updatePost } from './update-post'
import { verifyImage } from './verify-image'

exports.deletePost = functionsV2.firestore.onDocumentDeleted(
  'posts/{postId}',
  (snapshot) => deletePost(snapshot, db),
)

exports.updatePost = functionsV2.firestore.onDocumentUpdated(
  'posts/{postId}',
  (snapshot) => updatePost(snapshot, db),
)

exports.createComment = functionsV2.firestore.onDocumentCreated(
  'comments/{commentId}',
  (snapshot) =>
    Promise.all([
      addCommentCountToPost(snapshot, db),
      addNotification(snapshot, db, NotificationType.Comment),
    ]),
)

exports.deleteComment = functionsV2.firestore.onDocumentDeleted(
  'comments/{commentId}',
  (snapshot) => removeCommentFromPost(snapshot, db),
)

exports.onCreateLike = functionsV2.firestore.onDocumentCreated(
  'likes/{likeId}',
  (snapshot) => addNotification(snapshot, db, NotificationType.Like),
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

exports.verifyimage = functionsV2.https.onCall(
  { enforceAppCheck: true, memory: '1GiB' },
  verifyImage,
)
