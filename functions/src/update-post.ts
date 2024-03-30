import type * as admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import type {
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

export async function updatePost(
  event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>,
  db: admin.firestore.Firestore,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  const { userId } = snap.after.data()

  await db
    .collection('users_2')
    .doc(userId)
    .update({ posts: FieldValue.increment(1) })

  console.log(`Increasing ${userId}'s posts count by 1`)
}
