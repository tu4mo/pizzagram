import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

import { db } from './db'

export async function addUsernameToComment(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
) {
  const snapshot = event.data

  if (!snapshot) {
    return
  }

  const commentData = snapshot.data()
  const userDoc = await db.collection('users_2').doc(commentData.userId).get()
  const username = userDoc.data()?.username ?? ''

  console.log(`Adding username to comment ${snapshot.id}`)

  await db.collection('comments').doc(snapshot.id).update({ username })
}
