import type * as admin from 'firebase-admin'
import type {
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore'

export async function addComment(
  event: FirestoreEvent<QueryDocumentSnapshot | undefined>,
  db: admin.firestore.Firestore,
) {
  const snap = event.data

  if (!snap) {
    return
  }

  console.log(`Adding "createdAt" to comment ${snap.id}`)

  db.collection('comments').doc(snap.id).update({ createdAt: snap.createTime })
}
