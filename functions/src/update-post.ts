import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

import { updateUserPostsCount } from './utils/add-posts-count'

export default (db: admin.firestore.Firestore) => async (
  change: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => {
  const postData = change.after.data()

  if (!postData) {
    return
  }

  const { userId } = postData

  await updateUserPostsCount(db, userId)
}
