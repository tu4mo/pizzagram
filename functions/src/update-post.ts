import type * as admin from 'firebase-admin'
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

  const usersSnapshot = await db
    .collection('users')
    .where('id', '==', userId)
    .limit(1)
    .get()

  usersSnapshot.forEach(async (doc) => {
    const posts = Number(doc.data().posts) + 1 || 1

    console.log(`Increasing ${doc.id}'s posts count to ${posts}`)

    await db.collection('users').doc(doc.id).update({ posts })
  })
}
