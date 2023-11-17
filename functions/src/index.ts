import * as functionsV2 from 'firebase-functions/v2'

import { addCommentToPost } from './add-comment-to-post'
import { addNotification, NotificationType } from './add-notification'
import { db } from './db'
import { deletePost } from './delete-post'
import { deleteUser } from './delete-user'
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
      addCommentToPost(snapshot, db),
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

exports.deleteUser = deleteUser

exports.generateResizedImages = functionsV2.storage.onObjectFinalized(
  { memory: '1GiB' },
  (event) => Promise.all([resizeImage(event, true), resizeImage(event, false)]),
)

exports.verifyimage = functionsV2.https.onCall(
  { enforceAppCheck: true, memory: '1GiB' },
  verifyImage,
)
