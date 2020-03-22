import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

import addPostsCount from './utils/add-posts-count'
import generateThumbnail from './utils/generate-thumbnail'

import addNotification, { NotificationType } from './add-notification'
import resizeImage from './resize-image'
import removePost from './remove-post'
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

exports.addLikeNotification = functions.firestore
  .document('likes/{likeId}')
  .onCreate(addNotification(db, NotificationType.Like))

exports.generateResizedImages = functions.storage
  .object()
  .onFinalize((object) =>
    Promise.all([256, 1024].map((size) => resizeImage(object, size)))
  )

exports.addPostsCount = functions.https.onRequest(addPostsCount(db))

exports.generateThumbnail = functions.https.onRequest(() => {
  return [256, 1024].map((size) => generateThumbnail(size))
})
