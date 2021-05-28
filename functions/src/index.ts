import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

import addNotification, { NotificationType } from './add-notification'
import resizeImage from './resize-image'
import removePost from './remove-post'
import { updateLikes } from './update-likes'
import updatePost from './update-post'

admin.initializeApp()

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

exports.removePost = functions.firestore
  .document('posts/{postId}')
  .onDelete(removePost(db))

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

exports.generateResizedImages = functions.storage
  .object()
  .onFinalize((object) =>
    Promise.all([256, 1024].map((size) => resizeImage(object, size)))
  )
