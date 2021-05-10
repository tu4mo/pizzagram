import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export default (db: admin.firestore.Firestore) =>
  async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
    const postData = change.after.data()

    if (!postData) {
      return
    }

    const { userId } = postData

    const usersSnapshot = await db
      .collection('users')
      .where('id', '==', userId)
      .limit(1)
      .get()

    usersSnapshot.forEach(async (doc) => {
      const posts = doc.data().posts + 1 || 1

      console.log(`Increasing ${doc.id}'s posts count to ${posts}`)

      await db.collection('users').doc(doc.id).update({ posts })
    })
  }
