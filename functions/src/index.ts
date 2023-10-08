import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as functionsV2 from 'firebase-functions/v2'

import addNotification, { NotificationType } from './add-notification'
import resizeImage from './resize-image'
import { onDeletePost } from './on-delete-post'
import { updateLikes } from './update-likes'
import { updatePost } from './update-post'
import { onDeleteUser } from './on-delete-user'
import { verifyImage } from './verify-image'

admin.initializeApp()

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

exports.onDeletePost = functionsV2.firestore.onDocumentDeleted(
  'posts/{postId}',
  (snapshot) => onDeletePost(snapshot, db),
)

exports.updatePost = functionsV2.firestore.onDocumentUpdated(
  'posts/{postId}',
  (snapshot) => updatePost(snapshot, db),
)

exports.onCreateLike = functions.firestore
  .document('likes/{likeId}')
  .onCreate((snapshot) =>
    Promise.all([
      addNotification(snapshot, db, NotificationType.Like),
      updateLikes(snapshot, db, true),
    ]),
  )

exports.onDeleteLike = functions.firestore
  .document('likes/{likeId}')
  .onDelete((snapshot) => updateLikes(snapshot, db, false))

exports.onDeleteUser = functions.auth
  .user()
  .onDelete((user) => onDeleteUser(user, db))

exports.generateResizedImages = functionsV2.storage.onObjectFinalized(
  { memory: '1GiB' },
  (event) => Promise.all([resizeImage(event, true), resizeImage(event, false)]),
)

exports.verifyimage = functionsV2.https.onCall(
  { cors: true, memory: '1GiB' },
  verifyImage,
)
