import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as functionsV2 from 'firebase-functions/v2'

import addNotification, { NotificationType } from './add-notification'
import resizeImage from './resize-image'
import { onDeletePost } from './on-delete-post'
import { updateLikes } from './update-likes'
import updatePost from './update-post'
import { onDeleteUser } from './on-delete-user'
import { verifyImage } from './verify-image'

admin.initializeApp()

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

exports.onDeletePost = functions.firestore
  .document('posts/{postId}')
  .onDelete((snapshot) => onDeletePost(snapshot, db))

exports.updatePost = functions.firestore
  .document('posts/{postId}')
  .onUpdate(updatePost(db))

exports.onCreateLike = functions.firestore
  .document('likes/{likeId}')
  .onCreate((snapshot) =>
    Promise.all([
      addNotification(snapshot, db, NotificationType.Like),
      updateLikes(snapshot, db, true),
    ])
  )

exports.onDeleteLike = functions.firestore
  .document('likes/{likeId}')
  .onDelete((snapshot) => updateLikes(snapshot, db, false))

exports.onDeleteUser = functions.auth
  .user()
  .onDelete((user) => onDeleteUser(user, db))

exports.generateResizedImages = functions.storage
  .object()
  .onFinalize((object) =>
    Promise.all([resizeImage(object, true), resizeImage(object, false)])
  )

exports.verifyimage = functionsV2.https.onCall({ cors: true }, verifyImage)
