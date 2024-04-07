import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

import { comments, users } from './db'

export async function addUsernameToComment(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
) {
  const snapshot = event.data

  if (!snapshot) {
    return
  }

  const commentData = snapshot.data()
  const userDoc = await users.doc(commentData.userId).get()
  const username = userDoc.data()?.username ?? ''

  console.log(`Adding username to comment ${snapshot.id}`)

  await comments.doc(snapshot.id).update({ username })
}
