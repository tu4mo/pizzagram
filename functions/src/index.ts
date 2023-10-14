import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as functionsV2 from 'firebase-functions/v2'

import { addCommentToPost } from './add-comment-to-post'
import { addNotification, NotificationType } from './add-notification'
import { deletePost } from './delete-post'
import { deleteUser } from './delete-user'
import { resizeImage } from './resize-image'
import { updateLikes } from './update-likes'
import { updatePost } from './update-post'
import { verifyImage } from './verify-image'

admin.initializeApp()

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

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

exports.onCreateLike = functionsV2.firestore.onDocumentCreated(
  'likes/{likeId}',
  (snapshot) =>
    Promise.all([
      addNotification(snapshot, db, NotificationType.Like),
      updateLikes(snapshot, db, true),
    ]),
)

exports.deleteLike = functionsV2.firestore.onDocumentDeleted(
  'likes/{likeId}',
  (snapshot) => updateLikes(snapshot, db, false),
)

exports.deleteUser = functions.auth
  .user()
  .onDelete((user) => deleteUser(user, db))

exports.generateResizedImages = functionsV2.storage.onObjectFinalized(
  { memory: '1GiB' },
  (event) => Promise.all([resizeImage(event, true), resizeImage(event, false)]),
)

exports.verifyimage = functionsV2.https.onCall(
  { enforceAppCheck: true, memory: '1GiB' },
  verifyImage,
)
