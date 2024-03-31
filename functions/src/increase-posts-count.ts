import type { Firestore } from 'firebase-admin/firestore'
import { FieldValue } from 'firebase-admin/firestore'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

export async function increasePostsCount(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: Firestore,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const { userId } = snap.data()

  await db
    .collection('users_2')
    .doc(userId)
    .update({ postsCount: FieldValue.increment(1) })

  console.log(`Increasing ${userId}'s posts count by 1`)
}
